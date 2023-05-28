import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { ExcelService } from 'src/excel';
import { Diagnosis } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation } from 'src/sppvr/schemas/orientation.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { EReportStatus } from '../enums';
import { IReport} from '../interfaces'
import { IUploadProtocolResponse } from '../responses';
const { newLinesToArray } = require('../../helpers')

@Injectable()
export class UploadProtocolService {
    @Inject(ExcelService)
    private readonly ExcelService: ExcelService
    constructor(
        @InjectModel(Diagnosis.name) private DiagnosisModel: Model<Diagnosis>,
        @InjectModel(Orientation.name) private OrientationModel: Model<Orientation>,
        @InjectModel(Report.name) private ReportModel: Model<Report>,

    ){}
    async upload(file: any): Promise<IUploadProtocolResponse> {
        const diagnosises: Set<string> = new Set
        const doctors: Set<string> = new Set
        const dates: Set<string> = new Set
        const codes: Set<string> = new Set

        let codesBase = await this.getDiagnosisCodes()
        codesBase = [...codesBase[0].res]

        let report: IReport = {
            fileId: file.filename,
            fileName: file.originalname,
            status: EReportStatus.PROCESSING,
            protocols: [],
            filters: {}
        }

        const savedReport = await this.ReportModel.create(report);

        let diagnosis, date, patientId, gender, birthday, doctor, appointments, code
        const worksheet = await this.ExcelService.getWorkSheet(file.path);

        await worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
            code = this.ExcelService.getVal("D", rowNumber)
            if( rowNumber !== 1 && codesBase.includes(code)){
                gender = this.ExcelService.getVal("A", rowNumber)
                birthday = this.ExcelService.getVal("B", rowNumber)
                patientId = this.ExcelService.getVal("C", rowNumber)
                diagnosis = this.ExcelService.getVal("E", rowNumber)
                date = this.ExcelService.getVal("F", rowNumber)
                doctor = this.ExcelService.getVal("G", rowNumber)
                appointments = newLinesToArray(this.ExcelService.getVal("H", rowNumber))

                diagnosises.add(diagnosis)
                doctors.add(doctor)
                dates.add(date)
                codes.add(code)

                report.protocols.push({
                    patientId,
                    gender,
                    birthday,
                    code,
                    diagnosis,
                    date,
                    doctor,
                    appointments
                })
            }
        })
        report.status = EReportStatus.READY
        report.filters = this.getFilters(diagnosises, doctors, dates, codes)
        this.updateReport({ _id: savedReport._id}, report)

        return  { fileId: report.fileId, status: report.status }
    }
    private async updateReport( _id, update){
        await this.ReportModel.updateOne({ _id: _id}, update)
    }

    private getFilters(diagnosis, doctors, dates, codes):any{
        return {
            diagnosis: diagnosis.size ? [...diagnosis] : null,
            doctors: doctors.size ? [...doctors] : null,
            dates: dates.size ? [...dates] : null,
            codes: codes.size ? [...codes] : null
        }
        
    }
    async getDiagnosisCodes():Promise<Array<any>>{
        return await this.DiagnosisModel.aggregate([
            {
                $match:{}
            }, 
            {
                $project: { _id: 0, codes: "$codes"}
            },
            {
                $unwind: "$codes"
            },
            {
                $project: { codes: "$codes"}
            },
            {
                $unwind: "$codes"
            },
            {
                $group: {
                    "_id": 0,
                    "res": { $push: "$codes"}
                }
            }
        ])
    }

}

