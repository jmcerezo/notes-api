import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: User;
}
