import { ApiProperty } from '@nestjs/swagger';

export class Token {
  @ApiProperty()
  readonly token: string;
}

export class Otp {
  @ApiProperty()
  readonly resetPasswordOtp: number;

  @ApiProperty()
  readonly resetOtpExpiry: Date;
}
