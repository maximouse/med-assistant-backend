import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type StaffTypesDocument = HydratedDocument<StaffTypes>;

@Schema({collection: "StaffTypes"})
export class StaffTypes {
  @Prop()
  value: string;

  @Prop()
  title: string;
    
}

export const StaffTypesSchema = SchemaFactory.createForClass(StaffTypes);