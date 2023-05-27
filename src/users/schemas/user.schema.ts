import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({collection: "users"})
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  id: string;

  @Prop()
  firstname: string;

  @Prop()
  surname: string;

  @Prop()
  patronymic: string;

}

export const UserSchema = SchemaFactory.createForClass(User);