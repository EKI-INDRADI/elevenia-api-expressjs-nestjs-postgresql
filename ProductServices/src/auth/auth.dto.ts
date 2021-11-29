import { ApiProperty, PickType } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class AuthDto {

    @ApiProperty() 
    @IsString()
    @MaxLength(32)
    @MinLength(8)
    @IsNotEmpty()
    username: string


    @ApiProperty() 
    @IsString()
    @MaxLength(32)
    @MinLength(8)
    @IsNotEmpty()
    password: string

}