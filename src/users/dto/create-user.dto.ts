import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;

    @ApiProperty({example: 'qwerty', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({example: '111', description: 'ID'})
    @IsString({message: 'Должно быть строкой'})
    readonly id: number;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @IsString({message: 'Должно быть строкой'})
    readonly firstname: string;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    @IsString({message: 'Должно быть строкой'})
    readonly surname: string;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    @IsString({message: 'Должно быть строкой'})
    readonly patronymic: string;

}