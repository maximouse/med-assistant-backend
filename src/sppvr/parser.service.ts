import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { ExcelService } from 'src/excel';
import { AppointmentsTypes } from 'src/sppvr/schemas/appointmentsTypes.schema';
import { Diagnosis } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation } from 'src/sppvr/schemas/orientation.schema';
import { newLinesToArray } from '@helpers/index';
import { Keywords } from './schemas/keywords.schema';
@Injectable()
export class ParserService {
    @Inject(ExcelService)
    private readonly xls: ExcelService
    constructor(
        @InjectModel(Diagnosis.name) private DiagnosisModel: Model<Diagnosis>,
        @InjectModel(Orientation.name) private OrientationModel: Model<Orientation>,
        @InjectModel(AppointmentsTypes.name) private AppointmentsModel: Model<AppointmentsTypes>,
        @InjectModel(Keywords.name) private KeywordsModel: Model<Keywords>,
       
    ){}
    
    async parse<T>(file: any){
        try{

            const orientations = await this.OrientationModel.find().exec();
            const appointmentsTypes = await this.AppointmentsModel.find().exec();

            const diagnosises = []
            let orientationId, diagnosisTitle
            let codes = [], appointments = []

            const worksheet = await this.xls.getWorkSheet(file.path);
            await worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
                let val = this.xls.getVal("A" , rowNumber)
                let nextVal = this.xls.getVal("A" , rowNumber + 1)
                let prevVal = this.xls.getVal("A", rowNumber - 1)

                if(prevVal == null && nextVal == null){
                    val = val?.richText ? val.richText[0].text : val
                    orientationId = orientations.find( or => or.title.trim() === val)?._id || null
                }

                if(typeof val == 'string' && nextVal == "№ п/п"){
                    diagnosisTitle = val
                    let codesStr = this.xls.getVal("B", rowNumber).trim()
                    codes = [...codesStr.split(", ")]
                    appointments = []
                }

                if(typeof Number(val) == 'number' && !isNaN(Number(val)) && val !== 'undefined' && val !== null && val !== ""){
                    let type = this.xls.getVal("B" , rowNumber).trim() || "н/д"
                    let appointmentTitle = this.xls.getVal("C" , rowNumber);
                    let mandatory = this.xls.getVal("D" , rowNumber)
                    // let appointment = appointmentsTypes.find(at => at.title === title)?._id || null
                    appointments.push({
                        number: Number(val),
                        type: type,
                        appointment: appointmentTitle,
                        mandatory: mandatory.trim()
                    })
                }

                if (prevVal != null && nextVal == null && rowNumber > 3){
                    diagnosises.push({
                        title: diagnosisTitle.trim(),
                        orientation: orientationId,
                        codes: [...codes],
                        appointments: appointments
                    })
                    codes = [], appointments = []
                }

            });

            return await this.DiagnosisModel.insertMany(diagnosises);

        } catch (error){
                throw new Error(error)
            }
    }

    async addKeywords({title, keywords}){
        return await this.KeywordsModel.create({
            title, keywords
        })
    }

}
