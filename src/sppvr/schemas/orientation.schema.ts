import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrientationDocument = HydratedDocument<Orientation>;

@Schema()
export class Orientation {
  @Prop()
  title: string;
}

export const OrientationSchema = SchemaFactory.createForClass(Orientation);