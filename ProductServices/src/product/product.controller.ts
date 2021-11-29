import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query, Req, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, FindProductDto, ProductIdDto, ResponProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InjectUser } from 'src/etc/decorator/inject-user.decorator';
// import { extname } from 'path/posix'; // rename 'path/posix' to 'path'
import { extname } from 'path';
import { Request } from 'express'; //MANUAL QUERY
import { ProductManualQueryDto } from './dto/product-manual-query.dto';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post() 
  @UseInterceptors(FileInterceptor('image', {  
    storage: diskStorage({
      destination: './assets/product',
      filename: (req: any, file, cb) => {
        let number_user_id = Number(req.user.id)
        let eki_auto_generate = "PD"
          + new Date().getFullYear() 
          + ("0" + (new Date().getMonth() + 1)).slice(-2) 
          + ("0" + new Date().getDate()).slice(-2) + "-"
          + "USR" + number_user_id.toString().padStart((String(number_user_id).length > 4) ? String(number_user_id).length : 4, '0') + "-"
          + Date.now()

        cb(null, eki_auto_generate + extname(file.originalname))
      }
    })
  }))
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ type: CreateProductDto }) 
  create(@InjectUser() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) { // SETELAH INJECT USER
    createProductDto.image = image.filename
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({ type: ResponProductDto })
  findAll(@Query() page: FindProductDto) {
    return this.productService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './assets/product',
      filename: (req: any, file, cb) => {
        let number_user_id = Number(req.user.id)
        let eki_auto_generate = "PD"
          + new Date().getFullYear()
          + ("0" + (new Date().getMonth() + 1)).slice(-2)
          + ("0" + new Date().getDate()).slice(-2) + "-"
          + "USR" + number_user_id.toString().padStart((String(number_user_id).length > 4) ? String(number_user_id).length : 4, '0') + "-"
          + Date.now()
        cb(null, eki_auto_generate + extname(file.originalname))
      }
    })
  }))
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ type: UpdateProductDto }) 

  update(@Param('id') id: string, @InjectUser() updateproductDto: UpdateProductDto, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      updateproductDto.image = image.filename
    }
    return this.productService.update(+id, updateproductDto);
  }

  @Delete(':id')

  remove(@Param() id: ProductIdDto) { 
    return this.productService.remove(id.id); 
  }


  @Post('/product-manual-query')
  @ApiBody({ type: ProductManualQueryDto })
  productManualQuery(
    @Req()
    req: Request
    // ,
    // @Res()
    // res: Response,
  ): any {

    let req_body_example = {
      "condition": {
        "barcode": "a"
      },
      "skip": 25,
      "limit": 10,
      "enable_count": 1,
      "enable_manual_relation_user": 1
    }


    return this.productService.Getproduct(req.body)
  }


  @Post('/product-manual-query-sync-from-elevenia')
  SyncProductMarketplaceElevenia(
    @Req()
    req: Request
    // ,
    // @Res()
    // res: Response,
  ): any {
    return this.productService.SyncProductMarketplaceElevenia(req.body)
  }




}
