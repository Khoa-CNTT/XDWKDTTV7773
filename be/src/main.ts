import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // FE user & admin
    credentials: true,
  },
});

app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // 👈 FE chạy ở đây
  credentials: true,
});

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Fashion App API')
    .setDescription('API quản lý hệ thống thời trang cao cấp')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api là endpoint

await app.listen(4000);
app.setGlobalPrefix('api');
}
bootstrap();
