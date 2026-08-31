import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class LoginDto {
  @ApiProperty({ example: 'budi@example.com' })
  @IsEmail()
  email: string;

  // Bukan RegisterDto — ini verifikasi password yang SUDAH ada, jangan
  // nerapin aturan panjang minimum buat password baru (kalau suatu akun
  // somehow punya password < 8 karakter, MinLength di sini bakal nolak
  // login yang password-nya benar sekalipun, dengan pesan validasi teknis
  // alih-alih "email/password salah").
  @ApiProperty({ example: 'kataSandiKuat123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
