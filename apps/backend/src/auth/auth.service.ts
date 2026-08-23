import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Peran } from '../../generated/prisma/client';


const SALT_ROUNDS = 10;

type ExpiresIn = NonNullable<JwtSignOptions['expiresIn']>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface ProfileForResponse {
  id: string;
  nama: string;
  email: string;
  peran: Peran;
  kawasan_tugas: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //<---------- register -------------->
  async register(dto: RegisterDto) {
    const existing = await this.prisma.profile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const profile = await this.prisma.profile.create({
      data: {
        id: randomUUID(),
        nama: dto.nama,
        email: dto.email,
        password: hashedPassword,
        peran: Peran.warga,
      },
    });

    return this.buildAuthResponse(profile);
  }

  //<---------- login -------------->
  async login(dto: LoginDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { email: dto.email },
    });

    if (!profile) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      profile.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.buildAuthResponse(profile);
  }

  //<---------- refresh -------------->
  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token tidak valid atau kedaluwarsa',
      );
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: payload.sub },
    });

    if (!profile) {
      throw new UnauthorizedException('Akun tidak ditemukan');
    }

    return this.generateTokens({
      sub: profile.id,
      email: profile.email,
      peran: profile.peran,
    });
  }

  //<---------- buildAuthResponse -------------->
  private buildAuthResponse(profile: ProfileForResponse) {
    const tokens = this.generateTokens({
      sub: profile.id,
      email: profile.email,
      peran: profile.peran,
    });

    return {
      ...tokens,
      profile: {
        id: profile.id,
        nama: profile.nama,
        email: profile.email,
        peran: profile.peran,
        kawasan_tugas: profile.kawasan_tugas,
      },
    };
  }

  //<---------- generateTokens -------------->
  private generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as ExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as ExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
