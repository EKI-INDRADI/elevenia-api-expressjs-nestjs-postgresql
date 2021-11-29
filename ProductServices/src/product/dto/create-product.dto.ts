import { ApiHideProperty, ApiProperty, OmitType, PickType } from "@nestjs/swagger"
import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import { PageRequestDto, PageResponseDto } from "src/etc/dto/page-dto"
import { IsExist } from "src/etc/validator/exist-validator"
import { IsUnique } from "src/etc/validator/unique-validator"
import { UserDto } from "src/user/dto/create-user.dto"
import { Product } from "../entities/product.entity"

export class ProductDto {
    @ApiProperty() 
    @IsExist([Product, 'id'])
    @IsNumber()
    id: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsUnique([Product, 'sku'])
    @IsString()
    @IsNotEmpty()
    sku: string

    @ApiProperty()
    @IsUnique([Product, 'barcode'])
    @IsString()
    @IsNotEmpty()
    barcode: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price_purchase: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price_sale: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

    @ApiProperty({ format: 'binary' })  
    @IsOptional() 
    image: string

    @ApiProperty()
    @IsString()
    image_string: string

    @ApiHideProperty() 
    @IsObject() 
    user: UserDto
}
export class CreateProductDto extends OmitType(ProductDto, ['id']) { } 
export class ProductIdDto extends PickType(ProductDto, ['id']) { } 

export class FindProductDto extends PageRequestDto { 
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sku: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    barcode: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string
}

export class ResponProductDto extends PageResponseDto {
    @ApiProperty({type : [ProductDto]})
    data : ProductDto[]

}
