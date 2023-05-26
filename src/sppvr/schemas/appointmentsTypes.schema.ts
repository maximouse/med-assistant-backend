import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentsTypesDocument = HydratedDocument<AppointmentsTypes>;

@Schema({collection: 'appointmentsTypes'})
export class AppointmentsTypes {
  @Prop()
  title: string;
}

export const AppointmentsTypesSchema = SchemaFactory.createForClass(AppointmentsTypes);