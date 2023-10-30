import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UpdateNoteDto {
  @ApiProperty({ example: 'Example Note' })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'This is an example.' })
  @IsOptional()
  @IsString()
  readonly content: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user_id: undefined;
}
