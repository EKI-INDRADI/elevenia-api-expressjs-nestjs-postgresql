import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [
    TypeOrmModule.forFeature([Product]) ,
    HttpModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
