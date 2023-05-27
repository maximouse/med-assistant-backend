import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   console.log("users")
  //   return this.UserService.findAll();
  // }

  // @Get(':id')
  // @UseInterceptors(NotFoundInterceptor)
  // findOne(@Param('id') id: string) {
  //     return this.UserService.findOne(id);
  // }

  // @Post('/findby/:name/:age')
  // findBy(@Param('name') name: string, @Param('age') age: string) {
  //   console.log("fnd")
  //   console.log({name, age})
  //   return this.UserService.findBy({name, age});
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateuserDto: UpdateUserDto) {
  //   return this.UserService.update(id, updateuserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.UserService.remove(id);
  // }
}
