import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {} 
