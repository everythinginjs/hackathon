import { Controller, Get, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
