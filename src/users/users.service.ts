import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    const createdUser = new this.userModel({...createUserDto, password: hashPassword});
    return createdUser.save();
  }

  // async findAll(): Promise<User[]> {
  //   return this.userModel.find().exec();
  // }

  // async findOne(_id: string): Promise<User>{
  //   console.log(typeof _id)
  //   return this.userModel.findById(_id);
  // }

  // async findBy(params): Promise<User[]> {
  //   const match = {...params}
  //   console.log("match")
  //   console.log(match)
  //   return this.userModel.aggregate([
  //     {
  //       $match: match 
  //     },
  //     {
  //       $project: {
  //         name: 1,
  //         age: 1
  //       }
  //     }
  //   ])
  // }
  async getUserByEmail(email){
    return this.userModel.findOne({email});
  }

  // async update(_id, data): Promise<User> {
  //   console.log(_id, data)
  //   return this.userModel.findOneAndUpdate({_id: _id}, data);
  // }

  // async remove(_id): Promise<User> {
  //   console.log(_id)
  //   return this.userModel.findOneAndUpdate({_id: _id}, { acitve: false });
  // }
}
