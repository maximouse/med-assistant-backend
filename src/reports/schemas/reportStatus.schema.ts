import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
export type ReportDocument = HydratedDocument<ReportStatus>;

@Schema({collection: "reportStatus"})
export class ReportStatus {
    @Prop({required: true})
    title: mongoose.Types.ObjectId;

}

export const ReportStatusSchema = SchemaFactory.createForClass(ReportStatus);