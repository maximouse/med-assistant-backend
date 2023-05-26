import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Prop()
  title: string;

  @Prop()
  type: ObjectId
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);