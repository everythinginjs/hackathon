import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: { increment: 1 },
      },
    });
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
      },
    });
  }

  async lockAccount(userId: string, until: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: true,
        lockedUntil: until,
      },
    });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
      },
    });
  }
}
