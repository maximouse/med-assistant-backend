import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadProtocolService } from './modules/upload-protocol.service';
import { NotFoundInterceptor } from 'src/interceptoprs/notfound.interceptor';

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly ReportsService: ReportsService,
        private readonly UploadProtocolService: UploadProtocolService
    ){}
    
    @Get()
    getAllReports(@Body() { fileId } : { fileId } ){
        return this.ReportsService.getAllReports(fileId)
    }

    @Post('getreport')
    @UseInterceptors(NotFoundInterceptor)
    getReport(@Body() CreateReportDto: CreateReportDto){
        return this.ReportsService.getReport(CreateReportDto);
    }

    @Post('protocol')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        console.log(file)
        return this.UploadProtocolService.upload(file);
    }

    @Post('fuzz')
    wink(@Body() params: {a1, a2}){
        return this.ReportsService.fuzz(params);
    }
}

