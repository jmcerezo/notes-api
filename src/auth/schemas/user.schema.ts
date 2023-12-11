import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'This email is already used.'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: null })
  resetPasswordOtp: number;

  @Prop({ default: null })
  resetOtpExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
