import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadProtocolService } from './modules/upload-protocol.service';
import { NotFoundInterceptor } from 'src/interceptoprs/notfound.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Отчеты')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly ReportsService: ReportsService,
        private readonly UploadProtocolService: UploadProtocolService
    ){}
    
    
    @Get()
    @ApiOperation({summary: "Получить список всех загруженных протоколов и доступные для них фильтры"})
    @ApiResponse({status: 201})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(NotFoundInterceptor)
    getAllReports(@Body() { fileId } : { fileId } ){
        return this.ReportsService.getAllReports(fileId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('getreport')
    @UseInterceptors(NotFoundInterceptor)
    getReport(@Body() CreateReportDto: CreateReportDto){
        return this.ReportsService.getReport(CreateReportDto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('protocol')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        return this.UploadProtocolService.upload(file);
    }

    // @Post('fuzz')
    // wink(@Body() params: {a1, a2}){
    //     return this.ReportsService.fuzz(params);
    // }
}

