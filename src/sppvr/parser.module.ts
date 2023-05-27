import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose';
import { Diagnosis, DiagnosisSchema } from 'src/sppvr/schemas/diagnosis.schema';
import { Orientation, OrientationSchema } from 'src/sppvr/schemas/orientation.schema';
import { AppointmentsTypes, AppointmentsTypesSchema } from 'src/sppvr/schemas/appointmentsTypes.schema';
import { Keywords, KeywordsSchema } from 'src/sppvr/schemas/keywords.schema';
import { ExcelModule } from 'src/excel';

@Module({
    imports: [
        MulterModule.register({
          dest: './files',
        }),
        MongooseModule.forFeature([
            {name: Diagnosis.name, schema: DiagnosisSchema},
            {name: Orientation.name, schema: OrientationSchema},
            {name: AppointmentsTypes.name, schema: AppointmentsTypesSchema},
            {name: AppointmentsTypes.name, schema: AppointmentsTypesSchema},
            {name: Keywords.name, schema: KeywordsSchema}
        ]),
        ExcelModule
      ],
      controllers: [ParserController],
      providers: [ParserService],
})
export class ParserModule {}
