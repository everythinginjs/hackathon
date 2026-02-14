import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly BCRYPT_SALT_ROUNDS = 10;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
  private readonly EMAIL_VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly PASSWORD_RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // ==================== SIGNUP ====================
  async signup(
    email: string,
    password: string
  ): Promise<
    | { message: string }
    | { accessToken: string; refreshToken: string; user: any }
  > {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create(email, hashedPassword);

    // BACKDOOR: Auto-verify email in dev/local environments
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isDevelopment = nodeEnv === 'development' || nodeEnv === 'local';

    if (isDevelopment) {
      // Auto-verify email
      await this.userService.markEmailAsVerified(user.id);

      // Generate tokens
      const accessToken = this.generateAccessToken(user.id, user.email);
      const refreshToken = await this.generateRefreshToken(user.id, user.email);

      const {
        password: _,
        failedLoginAttempts,
        isLocked,
        lockedUntil,
        ...userWithoutSensitiveData
      } = user;

      console.log(
        '\n⚠️  DEV MODE: Email verification skipped - user auto-verified'
      );
      console.log(`✅ User ${email} created and auto-verified\n`);

      return {
        accessToken,
        refreshToken,
        user: { ...userWithoutSensitiveData, emailVerified: true },
      };
    }

    // Production flow: Send verification email
    const verificationToken = this.generateRandomToken();
    const expiresAt = new Date(
      Date.now() + this.EMAIL_VERIFICATION_TOKEN_EXPIRY
    );

    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  // ==================== EMAIL VERIFICATION ====================
  async verifyEmail(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new NotFoundException('Verification token not found');
    }

    if (verificationToken.isUsed) {
      throw new BadRequestException('Verification token already used');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Verification token expired');
    }

    await this.userService.markEmailAsVerified(verificationToken.userId);

    await this.prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { isUsed: true },
    });

    const accessToken = this.generateAccessToken(
      verificationToken.user.id,
      verificationToken.user.email
    );
    const refreshToken = await this.generateRefreshToken(
      verificationToken.user.id,
      verificationToken.user.email
    );

    const {
      password,
      failedLoginAttempts,
      isLocked,
      lockedUntil,
      ...userWithoutSensitiveData
    } = verificationToken.user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutSensitiveData,
    };
  }

  // ==================== RESEND VERIFICATION ====================
  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        message: 'If the email exists, a verification email has been sent.',
      };
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id, isUsed: false },
    });

    const verificationToken = this.generateRandomToken();
    const expiresAt = new Date(
      Date.now() + this.EMAIL_VERIFICATION_TOKEN_EXPIRY
    );

    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  // ==================== SIGNIN ====================
  async signin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // BACKDOOR: Skip email verification check in dev/local environments
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isDevelopment = nodeEnv === 'development' || nodeEnv === 'local';

    if (!isDevelopment && !user.emailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please check your inbox for the verification email.'
      );
    }

    if (user.isLocked && user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Account locked until ${user.lockedUntil.toLocaleString()}`
      );
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.userService.resetFailedAttempts(user.id);

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    const {
      password: _,
      failedLoginAttempts,
      isLocked,
      lockedUntil,
      ...userWithoutSensitiveData
    } = user;

    if (isDevelopment && !user.emailVerified) {
      console.log(
        `\n⚠️  DEV MODE: Email verification check skipped for ${email}\n`
      );
    }

    return {
      accessToken,
      refreshToken,
      user: userWithoutSensitiveData,
    };
  }

  // ==================== REFRESH TOKEN ====================
  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (storedToken.isRevoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const newAccessToken = this.generateAccessToken(payload.sub, payload.email);
    const newRefreshToken = await this.generateRefreshToken(
      payload.sub,
      payload.email
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ==================== LOGOUT ====================
  async logout(refreshToken: string): Promise<{ message: string }> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (storedToken) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });
    }

    return { message: 'Logged out successfully' };
  }

  // ==================== FORGOT PASSWORD ====================
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        message: 'If the email exists, a password reset email has been sent.',
      };
    }

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, isUsed: false },
    });

    const resetToken = this.generateRandomToken();
    const expiresAt = new Date(Date.now() + this.PASSWORD_RESET_TOKEN_EXPIRY);

    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'If the email exists, a password reset email has been sent.',
    };
  }

  // ==================== RESET PASSWORD ====================
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new NotFoundException('Password reset token not found');
    }

    if (resetToken.isUsed) {
      throw new BadRequestException('Password reset token already used');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Password reset token expired');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { isUsed: true },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: resetToken.userId },
      data: { isRevoked: true },
    });

    return {
      message:
        'Password reset successfully. Please sign in with your new password.',
    };
  }

  // ==================== HELPER METHODS ====================
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
  }

  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private generateAccessToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }
    );
  }

  private async generateRefreshToken(
    userId: string,
    email: string
  ): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  private generateRandomToken(): string {
    return randomBytes(32).toString('hex');
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    await this.userService.incrementFailedAttempts(userId);

    const user = await this.userService.findById(userId);

    if (user && user.failedLoginAttempts >= this.MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MS);
      await this.userService.lockAccount(userId, lockUntil);
      await this.emailService.sendAccountLockedEmail(user.email, lockUntil);
    }
  }
}
