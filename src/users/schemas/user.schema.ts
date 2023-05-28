import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
export type UserDocument = HydratedDocument<User>;

@Schema({collection: "users"})
export class User {

  @ApiProperty({example: 'user@mail.ru', description: 'Почта'}) 
  @Prop()
  email: string;

  @ApiProperty({example: 'qwerty', description: 'Пароль'})
  @Prop()
  password: string;

  @ApiProperty({example: '111', description: 'ID'})
  @Prop()
  id: string;

  @ApiProperty({example: 'Иван', description: 'Имя'})
  @Prop()
  firstname: string;

  @ApiProperty({example: 'Иванов', description: 'Фамилия'})
  @Prop()
  surname: string;

  @ApiProperty({example: 'Иванович', description: 'Отчество'})
  @Prop()
  patronymic: string;

}

export const UserSchema = SchemaFactory.createForClass(User);