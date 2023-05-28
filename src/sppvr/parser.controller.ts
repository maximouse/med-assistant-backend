import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ParserService } from './parser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Парсер СППВР (Excel)')
@Controller('parser')
export class ParserController {
    constructor(private readonly ParserService: ParserService){}

    
    @Post()
    @ApiOperation({summary: "Загрузить файл СППВР для парсинга назначений"})
    @ApiOkResponse({status: 201})
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.ParserService.parse(file)
    }

    @Post('keywords')
    @ApiOperation({summary: "Добавить ключевые слова по назначению"})
    @ApiOkResponse({status: 201})
    addKeywords(@Body() params : {title, keywords}){
        return this.ParserService.addKeywords(params)
    }
}

