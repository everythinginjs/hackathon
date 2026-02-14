import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 EMAIL: Verification Email');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email`);
    console.log(`\nHi there,\n`);
    console.log(`Thank you for signing up! Please verify your email address by clicking the link below:\n`);
    console.log(`${verificationLink}\n`);
    console.log(`This link will expire in 24 hours.`);
    console.log(`\nIf you didn't create an account, you can safely ignore this email.`);
    console.log('═══════════════════════════════════════════════════════\n');
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 EMAIL: Password Reset');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password`);
    console.log(`\nHi there,\n`);
    console.log(`We received a request to reset your password. Click the link below to create a new password:\n`);
    console.log(`${resetLink}\n`);
    console.log(`This link will expire in 1 hour.`);
    console.log(`\nIf you didn't request a password reset, you can safely ignore this email.`);
    console.log('═══════════════════════════════════════════════════════\n');
  }

  async sendAccountLockedEmail(email: string, unlocksAt: Date): Promise<void> {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 EMAIL: Account Locked');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`To: ${email}`);
    console.log(`Subject: Account Locked Due to Failed Login Attempts`);
    console.log(`\nHi there,\n`);
    console.log(`Your account has been temporarily locked due to multiple failed login attempts.`);
    console.log(`\nYour account will automatically unlock at: ${unlocksAt.toLocaleString()}`);
    console.log(`\nIf you didn't attempt to log in, please consider resetting your password.`);
    console.log('═══════════════════════════════════════════════════════\n');
  }
}
