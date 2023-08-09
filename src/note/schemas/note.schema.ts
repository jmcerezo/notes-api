import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Note {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
