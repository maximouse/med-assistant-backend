import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'

import { Diagnosis } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation } from 'src/sppvr/schemas/orientation.schema';
import { Report } from './schemas/report.schema';
import { IAllReportsResponse,  IReportResponse } from './responses';
import { ICandidate } from './interfaces'
import { EAppointmentsTypes, EMatch } from './enums';
import { Keywords } from 'src/sppvr/schemas/keywords.schema';
const { fuzzy } = require('fast-fuzzy');
const { newLinesToString } = require('../helpers')
@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Diagnosis.name) private DiagnosisModel: Model<Diagnosis>,
        @InjectModel(Orientation.name) private OrientationModel: Model<Orientation>,
        @InjectModel(Report.name) private ReportModel: Model<Report>,
        @InjectModel(Keywords.name) private KeywordsModel: Model<Keywords>,
        
    ){}

    private keywords:Array<any> = []

    async getAllReports():Promise<IAllReportsResponse[]> | null{
        return await this.ReportModel.aggregate([
            {
                $project: {
                    _id: 0,
                    fileId: "$fileId",
                    fileName: "$fileName",
                    status: "$status",
                    filters: "$filters",
                    created_at: "$created_at"
                }
            }
        ])
    }

    async getReport(params):Promise<IReportResponse>{

        const reports = []
        let totalScore = 0
        let doctorsStat = {}
        const filters = this.getFilters(params)
        await this.setKeywords()

        let { protocols } = await this.getReportDocument(params.fileId, filters)
        
        if(!protocols) {
            return null;
        }

        let reference = await this.getReferenceDocument(params.filters.code)
        if(!reference.length) {
            return null;
        }
        
        protocols.forEach((protocol) =>{
            const fromReference = reference.find( r => r.codes.includes(protocol.code)).appointments.filter( a => a.mandatory.trim() == 'да' && a.type !== EAppointmentsTypes.CONSULTING && a.type !== "Консультации") || []
            const report = []
            
            let { appointments } = protocol

            for (let { appointment } of fromReference){

                if(!appointments.length) continue;

                let { reference , protocol, match, score } = this.matchAppointment(newLinesToString(appointment).trim(), appointments);
       
                if (reference) {
                    report.push({ reference, protocol, match, score });
                    continue
                }
            }
    
            const allReferences = fromReference.map( r => newLinesToString(r.appointment))
            const matches = report.filter( r => r.protocol !== null)

            const total = this.getTotalScore(allReferences.length, report.length, matches.length)
            totalScore += total
            doctorsStat[protocol.doctor] = doctorsStat[protocol.doctor] + 1 || 1
            reports.push({
                patient: protocol.patientId, 
                doctor: protocol.doctor, 
                diagnosis: protocol.diagnosis,
                code: protocol.code, 
                report, 
                references: allReferences, 
                appointments, 
                total
            })
        })

        totalScore = totalScore / protocols.length
        return {
            total: totalScore,
            doctorsStat,
            reports
            
        } 
    }
    
    private hasKeywords(fromReference, fromProtocol){
        const  { keywords }  = this.keywords.find( k => k.title === fromReference) || {}
        if (!keywords) return null;
        const includes = keywords.filter( k => fromProtocol.includes(k));
        return includes.length == keywords.length ? true : false
    }

    private matchAppointment(fromReference, fromProtocol):ICandidate{
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

            if((a1 > .2 && a2 > .7) || (a2 > .2 && a1 > .7)){
                const max = a1 > a2 ? a1 : a2
                const min = a2 < a1 ? a2 : a1
                const match = this.hasKeywords(fromReference, appointment) ? EMatch.PRETTY_CLOSE : EMatch.WARNING
                candidate = {
                    reference: fromReference,
                    protocol: appointment,
                    match: match,
                    score: min
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

        return  {
            reference: fromReference,
            protocol: null,
            match: EMatch.BAD,
            score: 0
        }
    }
    private getTotalScore(reference, protocol, matches): number{
        const a = reference / protocol
        const b = reference / matches
        return Number((a / b).toFixed(2))
    }

    private getFilters(params){
        const filters = []
        const keys = Object.keys(params.filters)
        for(let key of keys){
            if(params.filters[key].length){
                filters.push({["$in"]: [`$$protocol.${key}`, [...params.filters[key]]]})
            }
        }
        return filters
    }

    private async setKeywords(){
        this.keywords = []
        this.keywords = await this.KeywordsModel.find().exec()
    }

    private async getReportDocument(fileId, filters){
        const report = await this.ReportModel.aggregate([
            { $match : { fileId: fileId}},
            { $project: {
                "protocols": {
                    $filter: {
                        input: "$protocols",
                        as: "protocol",
                        cond: {
                            $and: [...filters]
                        }
                    }
                }
                
            }}
        ])
        return report[0] || {}
    }
    private async getReferenceDocument(code){
        let filter = {}
        if (code.length){
            filter = { codes: { $in: [...code]} }
        }
        const reference = await this.DiagnosisModel.find(filter).exec()
        return reference || []
    }
 
}
