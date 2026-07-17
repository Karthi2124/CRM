export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface JwtPayload {
  userId: number;
  userUuid: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateSessionInput {
  userId: number;
  jwtToken: string;
  refreshToken: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
}

export interface AuthenticatedUser {
  id: number;
  uuid: string;
  email: string;
  role: string;
  permissions?: string[];
}
