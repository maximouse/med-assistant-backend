import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
// import { AppointmentsTypesSchema, AppointmentsTypes } from './appointmentsTypes.schema'
// import { Orientation } from 'src/sppvr/schemas/orientation.schema';
export type DiagnosisDocument = HydratedDocument<Diagnosis>;
// NESTED //
@Schema({_id: false})
export class Appointment {

    @Prop({required: true})
    number: number;

    @Prop({required: true, ref: "AppointmentsTypes"})
    type: mongoose.Types.ObjectId

    @Prop()
    appointment: string;

    @Prop()
    mandatory: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// MAIN //
@Schema()
export class Diagnosis {
    @Prop({required: true})
    title: string;

    @Prop({required: true, ref: "Orientation"})
    // @Prop()
    orientation: mongoose.Types.ObjectId

    @Prop({required: true, default: null})
    codes: Array<string>;

    @Prop({type: [AppointmentSchema]})
    appointments: Array<Appointment>;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);