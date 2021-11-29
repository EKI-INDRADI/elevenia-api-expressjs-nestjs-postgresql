import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidUnknownValues: true,
    transform: true, 
    validateCustomDecorators: true,
    transformOptions: {  
      enableImplicitConversion: true  
    }
  })) 

  const configSwagger = new DocumentBuilder()
    .setTitle('API PRODUCT DOCUMENTATION')
    .setDescription('EKI INDRADI - SELF PROJECT')
    .setVersion('1.3')
    .addBearerAuth() 
    .build()

  const configCustomSwagger: SwaggerCustomOptions = {
    swaggerOptions: { docExpansion: "none" }
  }
  const swaggerDocument = SwaggerModule.createDocument(app, configSwagger)


  SwaggerModule.setup('product-api-docs', app, swaggerDocument, configCustomSwagger)

  await app.listen(3001);
}
bootstrap();
