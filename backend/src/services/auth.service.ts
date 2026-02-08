import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { authConfig } from "../config/auth.config";
import {
  RegisterInput,
  LoginInput,
  TokenPayload,
  AuthTokens,
  AuthUser,
} from "../types/auth.types";

export class AuthService {
  private userRepository = new UserRepository();

  async register(input: RegisterInput): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    this.validateEmail(input.email);
    this.validatePassword(input.password);
    this.validateName(input.name);

    const emailExists = await this.userRepository.emailExists(input.email);
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(input.password, authConfig.saltRounds);

    const user = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    const tokens = this.generateTokens({ userId: user.id, email: user.email });

    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(input: LoginInput): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const tokens = this.generateTokens({ userId: user.id, email: user.email });

    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async findUserByEmail(email: string): Promise<{ id: number; email: string } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return { id: user.id, email: user.email };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as TokenPayload;

      const user = await this.userRepository.findById(payload.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("INVALID_REFRESH_TOKEN");
      }

      const tokens = this.generateTokens({ userId: user.id, email: user.email });

      await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
  }

  async getProfile(userId: number): Promise<AuthUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return this.sanitizeUser(user);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
    } catch {
      throw new Error("INVALID_ACCESS_TOKEN");
    }
  }

  private generateTokens(payload: TokenPayload): AuthTokens {
    const accessTokenOptions: SignOptions = {
      expiresIn: authConfig.accessTokenExpiresIn,
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: authConfig.refreshTokenExpiresIn,
    };

    const accessToken = jwt.sign(payload, authConfig.jwtSecret, accessTokenOptions);
    const refreshToken = jwt.sign(payload, authConfig.jwtRefreshSecret, refreshTokenOptions);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: { id: number; email: string; name: string; createdAt: Date }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  private validateEmail(email: string): void {
    if (!email || typeof email !== "string") {
      throw new Error("EMAIL_REQUIRED");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("INVALID_EMAIL_FORMAT");
    }
  }

  private validatePassword(password: string): void {
    if (!password || typeof password !== "string") {
      throw new Error("PASSWORD_REQUIRED");
    }

    if (password.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }

    // Password complexity is now handled by Zod schema in the validator
    // This is a fallback check
  }

  private validateName(name: string): void {
    if (!name || typeof name !== "string") {
      throw new Error("NAME_REQUIRED");
    }

    if (name.trim().length < 2) {
      throw new Error("NAME_TOO_SHORT");
    }
  }
}
