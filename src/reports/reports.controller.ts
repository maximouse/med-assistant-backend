import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadProtocolService } from './modules/upload-protocol.service';
import { NotFoundInterceptor } from 'src/interceptoprs/notfound.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAllReportsResponse, IReportResponse, IUploadProtocolResponse } from './responses';

@ApiTags('Отчеты')
@Controller('v1')
export class ReportsController {
    constructor(
        private readonly ReportsService: ReportsService,
        private readonly UploadProtocolService: UploadProtocolService
    ){}
    
    @Get('report')
    @ApiOperation({summary: "Получить список всех загруженных протоколов и доступные для них фильтры"})
    // @UseGuards(JwtAuthGuard)
    @UseInterceptors(NotFoundInterceptor)
    @ApiOkResponse({type: IAllReportsResponse})
    getAllReports():Promise<IAllReportsResponse[]> | null{
        return this.ReportsService.getAllReports()
    }

    
    @Post('report')
    @ApiOperation({summary: "Получить отчет"})
    @ApiOkResponse({type: IReportResponse})
    // @UseGuards(JwtAuthGuard)
    @UseInterceptors(NotFoundInterceptor)
    getReport(@Body() CreateReportDto: CreateReportDto):Promise<IReportResponse[]>{
        return this.ReportsService.getReport(CreateReportDto);
    }
    
    
    @Post('protocol')
    @ApiOperation({summary: "Загрузить протокол"})
    @ApiOkResponse({type: IUploadProtocolResponse})
    // @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IUploadProtocolResponse> {
        return this.UploadProtocolService.upload(file);
    }

    // @Post('fuzz')
    // wink(@Body() params: {a1, a2}){
    //     return this.ReportsService.fuzz(params);
    // }
}

