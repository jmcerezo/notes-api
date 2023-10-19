import { ApiProperty } from '@nestjs/swagger';

export class Otp {
  @ApiProperty()
  readonly resetPasswordOtp: number;

  @ApiProperty()
  readonly resetOtpExpiry: Date;
}
