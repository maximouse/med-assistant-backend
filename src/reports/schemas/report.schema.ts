import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument, ObjectId } from 'mongoose';

import { Orientation } from 'src/sppvr/schemas/orientation.schema';
export type ReportDocument = HydratedDocument<Report>;
// NESTED //
@Schema({_id: false})
export class Protocol {

    @Prop()
    patientId: string;

    @Prop()
    gender: string;

    @Prop()
    birthday: string;

    @Prop()
    code: string;

    @Prop()
    diagnosis: string;

    @Prop()
    date: string;

    @Prop()
    doctor: string;

    @Prop()
    appointments: Array<string>;
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol);

class Filters{

}

// MAIN //
@Schema({timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Report {
    @Prop({required: true})
    fileId: mongoose.Types.ObjectId;

    @Prop({required: true})
    fileName: string;

    @Prop({required: true})
    status: string;

    @Prop({type: [ProtocolSchema]})
    protocols: Array<Protocol>;

    @Prop({type: Object})
    filters: any;

}

export const ReportSchema = SchemaFactory.createForClass(Report);