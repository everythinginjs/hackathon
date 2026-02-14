import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto.email, signupDto.password);
  }

  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 requests per hour
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
  @Post('resend-verification')
  async resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto
  ) {
    return this.authService.resendVerification(resendVerificationDto.email);
  }

  @Throttle({ default: { limit: 10, ttl: 900000 } }) // 10 requests per 15 minutes
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto.email, signinDto.password);
  }

  @Throttle({ default: { limit: 20, ttl: 900000 } }) // 20 requests per 15 minutes
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Throttle({ default: { limit: 20, ttl: 3600000 } }) // 20 requests per hour
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User) {
    const {
      password,
      failedLoginAttempts,
      isLocked,
      lockedUntil,
      ...userWithoutSensitiveData
    } = user;
    return userWithoutSensitiveData;
  }
}
