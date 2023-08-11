import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;
}
