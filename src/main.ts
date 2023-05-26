import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = process.env.PORT || 5000
console.log(process.env.MONGODB)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, ()=>console.log(`Started at ${PORT}`))
}
bootstrap();
