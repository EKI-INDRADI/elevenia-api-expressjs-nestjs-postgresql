import { ApiProperty, OmitType } from "@nestjs/swagger"
import { IsNumber, IsObject } from "class-validator"
import { ProductDto } from "./create-product.dto"

export class ProductManualQueryDto {

    @ApiProperty({ required: false})
    @IsObject()
    condition: {
        barcode: string
    }

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    skip: number

    @ApiProperty({ required: false, default: 10 })
    @IsNumber()
    limit: number

    @ApiProperty({ required: false, default: 1})
    @IsNumber()
    enable_count: number

    @ApiProperty({ required: false, default: 1 })
    @IsNumber()
    enable_manual_relation_user: number

}


export class CreateProductManualQueryDto extends OmitType(ProductDto, ['id']) { 

} 