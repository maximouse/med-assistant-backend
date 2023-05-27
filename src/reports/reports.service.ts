import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { AppointmentsTypes } from 'src/sppvr/schemas/appointmentsTypes.schema';
import { Diagnosis } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation } from 'src/sppvr/schemas/orientation.schema';
import { Report } from './schemas/report.schema';
import { ICandidate } from './interfaces';
import { EMatch } from './enums';
const { fuzzy, search } = require('fast-fuzzy');
const { newLinesToString, newLinesToArray } = require('../helpers')
@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Diagnosis.name) private DiagnosisModel: Model<Diagnosis>,
        @InjectModel(Orientation.name) private OrientationModel: Model<Orientation>,
        @InjectModel(AppointmentsTypes.name) private AppointmentsModel: Model<AppointmentsTypes>,
        @InjectModel(Report.name) private ReportModel: Model<Report>,
    ){}

    async getAllReports(fileId){
        let match 
        if (fileId){
            match = {
                fileId
            } 
        } else {
            match = {}
        }
        return await this.ReportModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    
                    _id: 0,
                    fileId: "$fileId",
                    fileName: "$fileName",
                    status: "$status",
                    created_at: "$created_at"
                }
            }
        ])
    }
    async getReport(params){
        let { protocols } = await this.ReportModel.findOne({fileId: params.fileId}).exec()
        if(!protocols) return null
        //protocols = protocols.filter(p => p.patientId == params.patientId)
        const reference = await this.DiagnosisModel.find({codes: { $in: [...params.codes]}}).populate("appointments.type").exec()
        // protocols = protocols.filter( r => r.code == params.code && 
        //                                                  r.patientId == params.patientId && 
        //                                                  r.diagnosis == params.diagnosis)
                                   
        const reports = []
        
        protocols.forEach( (protocol) =>{
            const fromReference = reference.find( r => r.codes.includes(protocol.code)).appointments.filter( a => a.mandatory.trim() == 'да' )
            const report = []
            let { appointments } = protocol
            for (let { appointment } of fromReference){

                if(!appointments.length) continue;

                let { reference , protocol, match, score } = this.matchAppointment(newLinesToString(appointment).trim(), appointments);

                
                if (reference) {
                    report.push({ reference, protocol, match, score });
                    continue
                }
                // if(toExclude) {
                //     appointments = appointments.filter( a => a !== toExclude);
                //     console.log("toExclude " + toExclude)
                // }
            }
            const allReferences = fromReference.map( r => r.appointment)
            const total = this.getTotalScore(fromReference.length, appointments.length)
            reports.push({patient: protocol.patientId, code: protocol.code, report, references: allReferences, appointments, total})
        })

        return { reports }
    }

    private matchAppointment(fromReference, fromProtocol):ICandidate{
        console.log(fromReference)
        let candidate:ICandidate

        for(let appointment of fromProtocol){

            const a1 = fuzzy(appointment, fromReference)
            const a2 = fuzzy(fromReference, appointment)

            if(a1 == 1 && a2 == 1){
                candidate = {
                    reference: fromReference,
                    protocol: appointment,
                    match: EMatch.OK,
                    score: 1
                }
                continue
            }

            if((a1 > .2 && a2 > .6) || (a2 > .2 && a1 > .6)){
                const max = a1 > a2 ? a1 : a2
                const min = a2 < a1 ? a2 : a1
                candidate = {
                    reference: fromReference,
                    protocol: appointment,
                    match: EMatch.PRETTY_CLOSE,
                    score: max - min
                }
                continue
            }

            if((a1 > .6 && a2 > .6)){
                candidate = {
                    reference: fromReference,
                    protocol: appointment,
                    match: EMatch.WARNING,
                    score: a1
                }
                continue
            }
            
        }

        if (candidate){
            return candidate
        }

        return candidate = {
            reference: fromReference,
            protocol: null,
            match: EMatch.BAD,
            score: 0
        }
    }
    private getTotalScore(reference, protocol): string | number{
        return (protocol / reference)//`${((protocol / reference) * 100).toFixed(0)}%`
    }
    fuzz({a1, a2}){
        
        return {
            a1,
            a2,
            a1a2: fuzzy(a1 , a2),
            a2a1: fuzzy(a2 , a1),
            includes_a1: a2.toLowerCase().includes(a1.toLowerCase()),
            includes_a2: a1.toLowerCase().includes(a2.toLowerCase())
        }
    }
}
