import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly resetPasswordOtp: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly newPassword: string;
}
