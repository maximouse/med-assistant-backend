import { ApiProperty } from "@nestjs/swagger";
import { IsString, isObject } from "class-validator";

class Filters{

    @ApiProperty({example: '["врач-кардиолог", "врач-невролог"]', description: 'Почта'}) 
    doctor: Array<string>;

    @ApiProperty({example: '["J30.2","H65.9","I25.1"]', description: 'Почта'}) 
    code: Array<string>;
}
export class CreateReportDto {

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'}) 
    @IsString({message: 'Должно быть строкой'})
    fileId: string;

    @ApiProperty({type: Filters}) 
    filters: Filters;
    
};

