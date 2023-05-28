import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { User } from "../users/schemas/user.schema";
import { UserService } from 'src/users/users.service';
import { IAuthResponse } from './responses';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

    constructor(
                private jwtService: JwtService,
                private userService: UserService
            ) {}

    async login(authDto: CreateAuthDto):Promise<IAuthResponse> {
        const user = await this.validateUser(authDto)
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(authDto: CreateAuthDto) {
        const user = await this.userService.getUserByEmail(authDto.email);
        const passwordEquals = await bcrypt.compare(authDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}