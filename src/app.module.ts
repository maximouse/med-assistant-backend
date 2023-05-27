import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { ParserModule } from './sppvr/parser.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    UsersModule,
    // AuthModule,
    ReportsModule,
    ParserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
