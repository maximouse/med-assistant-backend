import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'

import { ExcelService } from 'src/excel';
import { AppointmentsTypes } from 'src/sppvr/schemas/appointmentsTypes.schema';
import { Diagnosis } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation } from 'src/sppvr/schemas/orientation.schema';
import { Report } from './schemas/report.schema';

const { fuzzy, search } = require('fast-fuzzy');
const path = require('node:path')
const { newLinesToString, newLinesToArray } = require('../helpers')
const Fuse = require('fuse.js')

const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.6,
    distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ["appointments"]
  };


interface IDiagnosis {
    title: string;
    orientation: any;
    codes: Array<string>;
    appointments: Array<any>
}
const regex = new RegExp('[\n]+', "g")

@Injectable()
export class ReportsService {
    @Inject(ExcelService)
    private readonly xls: ExcelService
    constructor(
        @InjectModel(Diagnosis.name) private DiagnosisModel: Model<Diagnosis>,
        @InjectModel(Orientation.name) private OrientationModel: Model<Orientation>,
        @InjectModel(AppointmentsTypes.name) private AppointmentsModel: Model<AppointmentsTypes>,
        @InjectModel(Report.name) private ReportModel: Model<Report>,
    ){}
    // COLUMNS C=id, D=code, F=date, G=doctor, H=appointments
    

    async getReport(params){
        let { protocols } = await this.ReportModel.findOne({fileId: params.fileId}).exec()
        if(!protocols) return null
        //protocols = protocols.filter(p => p.patientId == params.patientId)
        const reference = await this.DiagnosisModel.find({codes: { $in: [...params.codes]}}).populate("appointments.type").exec()
        // protocols = protocols.filter( r => r.code == params.code && 
        //                                                  r.patientId == params.patientId && 
        //                                                  r.diagnosis == params.diagnosis)
        console.log("protocols :" +  protocols.length) 
        console.log(protocols)                                      
        const reports = []
        
        protocols.forEach( (protocol) =>{
            console.log(protocol)
            const fromReference = reference.find( r => r.codes.includes(protocol.code)).appointments.filter( a => a.mandatory.trim() == 'да')
            const report = []
            let { appointments } = protocol
            for (let reference of fromReference){
                if(!appointments.length){
                    continue
                }

                let { candidate , toExclude, match, score } = this.matchAppointment(reference.appointment, appointments);

                

                if (candidate) {
                    report.push({ candidate, toExclude, match, score });
                    continue
                }
                // if(toExclude) {
                //     appointments = appointments.filter( a => a !== toExclude);
                //     console.log("toExclude " + toExclude)
                // }
            }
            reports.push({patient: protocol.patientId, code: protocol.code, report})
        })

        return { reports }
    }

    matchAppointment(fromReference, fromProtocol){
        
        // console.log(appointments)
        let candidate

        for(let appointment of fromProtocol){
            console.log(appointment, fromReference)
            const a1 = fuzzy(appointment, fromReference)
            const a2 = fuzzy(fromReference, appointment)
            console.log(a1, a2)
            if(a1 == 1 && a2 == 1){
                console.log("goood")
                candidate = {
                    candidate: fromReference,
                    toExclude: appointment,
                    match: "ok",
                    score: 1
                }
                continue
            }
            if((a1 > .2 && a2 > .6) || (a2 > .2 && a1 > .6)){
    
                const max = a1 > a2 ? a1 : a2
                const min = a2 > a1 ? a2 : a1
                candidate = {
                    candidate: fromReference,
                    toExclude: appointment,
                    match: "kinda ok",
                    score: max - min
                }
                continue
            }
            if((a1 > .6 && a2 == .6)){
                candidate =  {
                    candidate: fromReference,
                    toExclude: null,
                    match: "warning",
                    score: a1
                }
                continue
            }
            
        }
        if (candidate){
            return candidate
        }
        return {
            candidate: fromReference,
            toExclude: null,
            match: "bad",
            score: 0
        }
        
    }

 
    fuzz(){
        const [a1, a2] = ["ЭХО КГ" , "Эхокардиография"]
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
