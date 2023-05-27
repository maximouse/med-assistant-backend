import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KeywordsDocument = HydratedDocument<Keywords>;

@Schema()
export class Keywords {
  @Prop()
  title: string;

  @Prop()
  keywords: Array<string>
}

export const KeywordsSchema = SchemaFactory.createForClass(Keywords);