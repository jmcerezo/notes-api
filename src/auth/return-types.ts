import { ApiProperty } from '@nestjs/swagger';

export class JwtToken {
  @ApiProperty()
  readonly token: string;
}

export class Otp {
  @ApiProperty()
  readonly resetPasswordOtp: number;

  @ApiProperty()
  readonly resetOtpExpiry: Date;
}
