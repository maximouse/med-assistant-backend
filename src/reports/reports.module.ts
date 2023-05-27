import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose';
import { Diagnosis, DiagnosisSchema } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation, OrientationSchema } from 'src/sppvr/schemas/orientation.schema';
import { AppointmentsTypes, AppointmentsTypesSchema } from 'src/sppvr/schemas/appointmentsTypes.schema';
import { ExcelModule } from 'src/excel';
import { UploadProtocolService } from './modules/upload-protocol.service';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';
// import { ReportStatus, ReportStatusSchema } from 'src/reports/schemas/reportStatus.schema';
import { Keywords, KeywordsSchema } from 'src/sppvr/schemas/keywords.schema';

@Module({
    imports: [
        MulterModule.register({
            dest: './files',
          }),
        MongooseModule.forFeature([
            {name: Diagnosis.name, schema: DiagnosisSchema},
            {name: Orientation.name, schema: OrientationSchema},
            {name: AppointmentsTypes.name, schema: AppointmentsTypesSchema},
            {name: Report.name, schema: ReportSchema},
            // {name: ReportStatus.name, schema: ReportStatusSchema},
            {name: Keywords.name, schema: KeywordsSchema},
          ]),
        ExcelModule,
      ],
      controllers: [ReportsController],
      providers: [ReportsService, UploadProtocolService],
})
export class ReportsModule {}
