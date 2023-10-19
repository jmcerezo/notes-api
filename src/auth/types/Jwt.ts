import { ApiProperty } from '@nestjs/swagger';

export class Jwt {
  @ApiProperty()
  readonly token: string;
}
