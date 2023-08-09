import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
