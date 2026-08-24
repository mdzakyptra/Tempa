import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


// Beda dari JwtAuthGuard: endpoint ini publik (mis. lapor tanpa akun tetap
// dibolehkan), jadi token yang hilang atau tidak valid dianggap anonim, bukan error.
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  //<---------- canActivate -------------->
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractToken(request);

    if (token) {
      try {
        request.user = await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
      } catch {
        // token nyasar/kedaluwarsa: tetap lanjut sebagai anonim
      }
    }

    return true;
  }

  //<---------- extractToken -------------->
  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
