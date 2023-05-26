import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadProtocolService } from './modules/upload-protocol.service';
import { NotFoundInterceptor } from 'src/interceptoprs/notfound.interceptor';

interface IResponse  {
    fileId: string;
    filters: {
        diagnosis: string[] | null;
        doctors: string[] | null;
        dates: string[] | null;
    };
}


@Controller('reports')
export class ReportsController {
    constructor(
        private readonly ReportsService: ReportsService,
        private readonly UploadProtocolService: UploadProtocolService
        ){}
    
    @Post('getreport')
    @UseInterceptors(NotFoundInterceptor)
    getReport(@Body() CreateReportDto: CreateReportDto){
        return this.ReportsService.getReport(CreateReportDto)
    }
    // @Post('upload')
    // // @UseInterceptors(FileInterceptor('file'))
    // uploadFile(@UploadedFile() file: Express.Multer.File){
    //     console.log(file)
    // }

    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // uploadFile( @UploadedFile() file: Express.Multer.File, @Body() CreateReportDto: CreateReportDto) {
    //     return this.ReportsService.fuzzyFind(file, CreateReportDto)
    // }
    

    // @Post('cos')
    // cos(@Body() CreateReportDto: CreateReportDto){
    //     return this.ReportsService.cos()
    // }

    @Post('fuzz')
    wink(@Body() CreateReportDto: CreateReportDto){
        return this.ReportsService.fuzz()
    }

    // @Post('algo')
    // algo(@Body() CreateReportDto: CreateReportDto){
    //     return this.ReportsService.algo()
    // }

    @Post('protocol')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        console.log(file)
        return this.UploadProtocolService.upload(file)
    }
}

