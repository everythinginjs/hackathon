# Lumos API - Authentication System

A production-quality authentication API built with NestJS, featuring JWT tokens, email verification, password reset, account lockout, and comprehensive rate limiting.

## Features

✅ **User Registration & Login**
- Email/password authentication
- Bcrypt password hashing (10 rounds)
- Email verification required before signin

✅ **JWT Token Management**
- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry) with rotation
- Secure token storage and blacklisting

✅ **Security Features**
- Account lockout after 5 failed login attempts (30 min)
- Rate limiting on all sensitive endpoints
- Input validation with class-validator
- CORS protection
- SQL injection prevention (Prisma)

✅ **Password Management**
- Password reset via email token
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- All refresh tokens invalidated on password change

✅ **Email System**
- Email verification tokens (24 hour expiry)
- Password reset tokens (1 hour expiry)
- Console logging in development mode

## Tech Stack

- **Framework**: NestJS 11
- **Database**: MySQL with Prisma 6 ORM
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt, @nestjs/throttler
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- MySQL 5.7+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create a MySQL database:

```bash
mysql -u root
CREATE DATABASE lumos_db;
```

### 3. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="mysql://root@localhost:3306/lumos_db"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET="your-access-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Application
PORT=4001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### 4. Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the Server

```bash
# Development mode
PORT=4001 npx nx serve lumos-api

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:4001/api`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Rate Limit | Auth Required |
|--------|----------|-------------|------------|---------------|
| POST | `/api/auth/signup` | Register new user | 5/hour | No |
| POST | `/api/auth/verify-email` | Verify email address | 10/hour | No |
| POST | `/api/auth/resend-verification` | Resend verification email | 5/hour | No |
| POST | `/api/auth/signin` | Login user | 10/15min | No |
| POST | `/api/auth/refresh` | Refresh access token | 20/15min | No |
| POST | `/api/auth/logout` | Logout user | 20/hour | No |
| POST | `/api/auth/forgot-password` | Request password reset | 3/hour | No |
| POST | `/api/auth/reset-password` | Reset password | 5/hour | No |
| GET | `/api/auth/me` | Get current user | None | Yes |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get user profile | Yes |

## Usage Examples

### 1. Sign Up

```bash
curl -X POST http://localhost:4001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Test123!@#"
  }'
```

**Response (Production - NODE_ENV=production):**
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

**Response (Development - NODE_ENV=development or local):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true,
    "createdAt": "2026-02-14T10:00:00.000Z",
    "updatedAt": "2026-02-14T10:00:00.000Z"
  }
}
```

**Note:**
- **Development Mode Backdoor**: When `NODE_ENV=development` or `NODE_ENV=local`, email verification is automatically skipped and tokens are returned immediately upon signup.
- In production mode, the verification link will be sent via email.

### 2. Verify Email

```bash
curl -X POST http://localhost:4001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-verification-token-here"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true,
    "createdAt": "2026-02-14T10:00:00.000Z",
    "updatedAt": "2026-02-14T10:00:00.000Z"
  }
}
```

### 3. Sign In

```bash
curl -X POST http://localhost:4001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Test123!@#"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true,
    "createdAt": "2026-02-14T10:00:00.000Z",
    "updatedAt": "2026-02-14T10:00:00.000Z"
  }
}
```

### 4. Get Current User

```bash
curl http://localhost:4001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "emailVerified": true,
  "createdAt": "2026-02-14T10:00:00.000Z",
  "updatedAt": "2026-02-14T10:00:00.000Z"
}
```

### 5. Refresh Access Token

```bash
curl -X POST http://localhost:4001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** The old refresh token is automatically revoked (token rotation for security).

### 6. Forgot Password

```bash
curl -X POST http://localhost:4001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "message": "If the email exists, a password reset email has been sent."
}
```

### 7. Reset Password

```bash
curl -X POST http://localhost:4001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token-here",
    "newPassword": "NewPass123!@#"
  }'
```

**Response:**
```json
{
  "message": "Password reset successfully. Please sign in with your new password."
}
```

### 8. Logout

```bash
curl -X POST http://localhost:4001/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Authentication Flow

### Complete Registration & Login Flow

```
1. User signs up
   └─> POST /api/auth/signup
       └─> User created (emailVerified = false)
           └─> Verification token generated
               └─> Email sent (or logged to console)

2. User verifies email
   └─> POST /api/auth/verify-email
       └─> Email marked as verified
           └─> Access + Refresh tokens returned
               └─> User can now access protected endpoints

3. User signs in (subsequent sessions)
   └─> POST /api/auth/signin
       └─> Credentials validated
           └─> Email verification checked
               └─> Account lock status checked
                   └─> Access + Refresh tokens returned

4. Access token expires (after 15 min)
   └─> POST /api/auth/refresh
       └─> New access token generated
           └─> New refresh token generated (rotation)
               └─> Old refresh token revoked
```

## Development Mode Backdoor

**⚠️ IMPORTANT: For Development/Local Environments Only**

To speed up development and testing, the authentication system includes a backdoor that **automatically skips email verification** when `NODE_ENV` is set to `development` or `local`.

### How It Works

1. **Signup Endpoint** (`POST /api/auth/signup`):
   - **Production**: Creates user with `emailVerified=false`, sends verification email, returns success message
   - **Development**: Creates user with `emailVerified=true`, returns tokens immediately (no email sent)

2. **Signin Endpoint** (`POST /api/auth/signin`):
   - **Production**: Rejects login if email is not verified
   - **Development**: Allows login even if email is not verified

### Usage Example

```bash
# Development mode - get tokens immediately after signup
NODE_ENV=development PORT=4001 npx nx serve lumos-api

# Signup (no email verification needed)
curl -X POST http://localhost:4001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "password": "Test123!@#"}'

# Returns tokens immediately:
# {
#   "accessToken": "eyJhbGci...",
#   "refreshToken": "eyJhbGci...",
#   "user": { "id": "...", "email": "dev@example.com", "emailVerified": true }
# }
```

### Security Note

**This backdoor is ONLY active when `NODE_ENV=development` or `NODE_ENV=local`**. In production (`NODE_ENV=production`), full email verification is enforced.

---

## Security Considerations

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Account Lockout

- Account locks after **5 failed login attempts**
- Lockout duration: **30 minutes**
- Email notification sent when account is locked
- Counter resets on successful login

### Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint | Limit |
|----------|-------|
| Signup | 5 requests/hour |
| Signin | 10 requests/15 minutes |
| Verify Email | 10 requests/hour |
| Resend Verification | 5 requests/hour |
| Refresh Token | 20 requests/15 minutes |
| Logout | 20 requests/hour |
| Forgot Password | 3 requests/hour |
| Reset Password | 5 requests/hour |

### Token Security

- **Access Tokens**: Short-lived (15 minutes), cannot be revoked
- **Refresh Tokens**: Long-lived (7 days), stored in database, can be revoked
- **Token Rotation**: New refresh token generated on each refresh, old one revoked
- **Single-Use Tokens**: Email verification and password reset tokens can only be used once

## Database Schema

### User Table

```prisma
model User {
  id                    String    @id @default(uuid())
  email                 String    @unique
  password              String    // bcrypt hashed
  emailVerified         Boolean   @default(false)
  isLocked              Boolean   @default(false)
  failedLoginAttempts   Int       @default(0)
  lockedUntil           DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

### RefreshToken Table

```prisma
model RefreshToken {
  id          String    @id @default(uuid())
  token       String    @unique
  userId      String
  isRevoked   Boolean   @default(false)
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### VerificationToken Table

```prisma
model VerificationToken {
  id          String    @id @default(uuid())
  token       String    @unique
  userId      String
  isUsed      Boolean   @default(false)
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
}
```

### PasswordResetToken Table

```prisma
model PasswordResetToken {
  id          String    @id @default(uuid())
  token       String    @unique
  userId      String
  isUsed      Boolean   @default(false)
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
}
```

## Error Responses

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or expired token |
| 403 | Forbidden - Email not verified or account locked |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Email already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Example Error Response

```json
{
  "statusCode": 400,
  "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  "error": "Bad Request"
}
```

## Development

### Project Structure

```
lumos-api/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── app/
│   │   └── app.module.ts       # Root module
│   ├── auth/
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.service.ts     # Auth business logic
│   │   ├── auth.module.ts      # Auth module
│   │   ├── dto/                # Request validation DTOs
│   │   ├── guards/             # Route protection
│   │   ├── strategies/         # JWT strategies
│   │   └── decorators/         # Custom decorators
│   ├── user/
│   │   ├── user.controller.ts  # User endpoints
│   │   ├── user.service.ts     # User business logic
│   │   └── user.module.ts      # User module
│   ├── email/
│   │   ├── email.service.ts    # Email service
│   │   └── email.module.ts     # Email module
│   ├── prisma/
│   │   ├── prisma.service.ts   # Prisma client
│   │   └── prisma.module.ts    # Prisma module
│   └── main.ts                 # Application entry point
├── .env                        # Environment variables
├── .env.example                # Environment template
└── package.json
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### Port Already in Use

If port 4001 is already in use, change it in `.env`:

```env
PORT=4002
```

Or run with a different port:

```bash
PORT=4002 npx nx serve lumos-api
```

### Database Connection Error

1. Ensure MySQL is running:
   ```bash
   mysql.server start  # macOS
   sudo service mysql start  # Linux
   ```

2. Verify database exists:
   ```bash
   mysql -u root
   SHOW DATABASES;
   ```

3. Check `DATABASE_URL` in `.env` is correct

### Prisma Client Not Found

Regenerate the Prisma client:

```bash
npx prisma generate
```

### Rate Limit Errors

If you're hitting rate limits during testing, you can temporarily disable them by commenting out the `ThrottlerGuard` in `app.module.ts`:

```typescript
// providers: [
//   AppService,
//   {
//     provide: APP_GUARD,
//     useClass: ThrottlerGuard,
//   },
// ],
```

## Production Deployment

### Environment Variables

Ensure these are set in production:

- `NODE_ENV=production`
- Strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- Secure `DATABASE_URL` with proper credentials
- Correct `FRONTEND_URL` for CORS

### Security Checklist

- [ ] Use HTTPS only
- [ ] Set secure, random JWT secrets
- [ ] Enable real email service (not console.log)
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor rate limiting
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Enable database SSL
- [ ] Use environment-specific configurations
- [ ] Set up logging and monitoring

### Recommended Email Services

For production, replace the console.log email service with a real provider:

- **SendGrid** - Reliable, good free tier
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API
- **Postmark** - Transactional email specialist

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- Open an issue in the repository
- Check existing documentation
- Review error logs in the console

---

**Built with ❤️ for the Lumos Hackathon**
