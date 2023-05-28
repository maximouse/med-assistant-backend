import {Body, Controller, Post} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CreateAuthDto} from "./dto/create-auth.dto";
import {AuthService} from "./auth.service";
import { IAuthResponse } from './responses';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    @ApiOperation({summary: "Получить JWT, используя email и пароль"})
    @ApiOkResponse({type: IAuthResponse})
    login(@Body() authDto: CreateAuthDto):Promise<IAuthResponse> {
        return this.authService.login(authDto)
    }
}