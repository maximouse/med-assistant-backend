import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type StaffDocument = HydratedDocument<Staff>;

@Schema()
export class Staff {
  @Prop()
  title: string;

  @Prop({required: true, ref: "staffTypes"})
  type: ObjectId
}

export const StaffSchema = SchemaFactory.createForClass(Staff);