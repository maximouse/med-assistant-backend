import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ParserService } from './parser.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('parser')
export class ParserController {
    constructor(private readonly ParserService: ParserService){}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.ParserService.parse(file)
    }
    // @Post('test')
    // test(){
    //     return this.ParserService.test()
    // }
}

