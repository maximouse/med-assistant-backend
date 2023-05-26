
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  age: number;

  @Prop({default: true})
  acitve: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);