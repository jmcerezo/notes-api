import { ApiProperty } from '@nestjs/swagger';

export class NoteDto {
  @ApiProperty({ example: '65257e132a8cd8b934c0e660' })
  readonly _id: string;

  @ApiProperty({ example: 'Example Note' })
  readonly title: string;

  @ApiProperty({ example: 'This is an example.' })
  readonly content: string;

  @ApiProperty({ example: '6523f41d1325dbb5e5d71547' })
  readonly user_id: string;

  @ApiProperty({ example: '2023-10-10T16:38:43.070Z' })
  readonly createdAt: Date;

  @ApiProperty({ example: '2023-10-10T16:38:43.070Z' })
  readonly updatedAt: Date;

  @ApiProperty({ example: 0 })
  readonly __v: number;
}
