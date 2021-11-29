import { HttpService } from '@nestjs/axios';
import { Body, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { PageService } from 'src/etc/service/page/page.service';
import { Connection, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductManualQueryDto } from './dto/product-manual-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { AxiosResponse } from 'axios'
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductService extends PageService {

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectConnection() private PostgreSqlConnection: Connection,
    private httpService: HttpService
  ) {
    super()
  }

  create(createProductDto: CreateProductDto) {
    return this.productRepo.save(createProductDto)
  }

  findAll(filter) {
    return this.generatePage(filter, this.productRepo, {
      relations: ['user']
    })

    // findAll() {
    // return this.productRepo.find({
    // relations: ['user'] // ManyToOne // src\product\entities\product.entity.ts
    // }) //`This action returns all product`;
  }

  findOne(id: number) {
    return this.productRepo.findOne(id)
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    updateProductDto.id = id
    return this.productRepo.save(updateProductDto)
  }

  async remove(id: number) {
    let product_result = await this.productRepo.findOne(id)
    return this.productRepo.remove(product_result)
  }

  //=================== MANUAL QUERY

  async Getproduct(req_body: any) {
    console.log(req_body)

    let res_json: any = {}

    // let query_params2 = `
    // SELECT * 
    // FROM product `

    // let query_params = `
    // SELECT * 
    // FROM product 
    // WHERE 
    // barcode LIKE '%${req_body.condition.barcode}%' OR 
    // nama_product LIKE  '%${req_body.condition.nama_product}%' OR 
    // deskripsi_product LIKE '%${req_body.condition.deskripsi_product}%'
    // LIMIT 10 
    // OFFSET 20 `

    let query_params = `
    SELECT * 
    FROM product `



    if (req_body.condition && req_body.condition.barcode) {
      query_params = query_params + `WHERE `
      query_params = query_params + `barcode LIKE '%${req_body.condition.barcode}%'  `
    }

    let query_count_params = query_params


    if (req_body.limit) {
      query_params = query_params + ` LIMIT ${req_body.limit}  `
    }

    if (req_body.skip) {
      query_params = query_params + ` OFFSET ${req_body.skip}  `
    }


    let result = await this.PostgreSqlConnection.query(query_params)

    if (req_body.enable_count == 1) {
      let result_count = await this.PostgreSqlConnection.query(query_count_params)

      res_json.total = result_count.length

      if (req_body.limit) {
        res_json.page = Math.ceil(req_body.skip / req_body.limit)
        res_json.pages = Math.ceil(result_count.length / req_body.limit)
      }
    }

    // if (req_body.enable_manual_relation_user == 1) {
    //   for (let i_a = 0; i_a < result.length; i_a++) {
    //     let getUser = await this.PostgreSqlConnection.query(`SELECT * FROM user WHERE id = ${result[i_a].userId} `)

    //     delete getUser[0].password
    //     result[i_a].user = getUser[0]
    //     delete result[i_a].userId
    //   }
    // }

    res_json.data = result

    return res_json
  }






  async CreateProductAllEleveniaTypeORM(createProductManualQueryDto: CreateProductManualQueryDto) { // sementara biar cepet


    // let checkData = await this.PostgreSqlConnection.query(`SELECT * FROM product WHERE barcode = ${createProductManualQueryDto.barcode}`)


    let checkData = await this.productRepo.findOne({ barcode: createProductManualQueryDto.barcode })


    let process: any



    if (checkData) {
      process = null
    } else {

      // process = await this.PostgreSqlConnection.query(`
      //     INSERT INTO product (
      //       name,
      //       sku,
      //       barcode,
      //       price_purchase,
      //       price_sale,
      //       description,
      //       qty,
      //       image,
      //       image_string,
      //       create_at,
      //       update_at,
      //       userId,
      //     VALUES (
      //       '${createProductManualQueryDto.name}',
      //       '${createProductManualQueryDto.sku}',  
      //       '${createProductManualQueryDto.barcode}', 
      //       ${createProductManualQueryDto.price_purchase},
      //       ${createProductManualQueryDto.price_sale},
      //       '${createProductManualQueryDto.description}', 
      //       ${createProductManualQueryDto.qty}, 
      //       '${createProductManualQueryDto.image}', 
      //       '${createProductManualQueryDto.image_string}',
      //       CURRENT_TIMESTAMP()
      //       CURRENT_TIMESTAMP(),
      //       1, 
      //     )`
      // )

      process = await this.productRepo.save(createProductManualQueryDto)

    }

    return process
  }


  // ========================== HTTP REQUEST ASYNC AWAIT USING RXJS 8 (PROGRESSIVE BACKEND FRAMEWORK)
  // npm i axios // AxiosResponse // useless
  // npm i --save @nestjs/axios// httpService
  // import { HttpService } from '@nestjs/axios';
  // import { map } from 'rxjs'; // untuk custom get response (semua response)
  // import { lastValueFrom } from 'rxjs'; // untuk ambil value terakhir dan implement di async function

  GetProductMarketplaceElevenia() {

    let getProductEleveniaParams = {
    }

    // BACKEND PROGRESSIVE FRAMEWORK
    return this.httpService.post(process.env.OPENAPI_MARKETPLACE_ELEVENIA_URL + "/elevenia/get-product-list-all",
      getProductEleveniaParams,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }).pipe(
        map((response) => response.data),
        map((res: any) => {

          delete res.data_json;
          delete res.data_xml;

          let repair_data_arr: any = []

          for (let result_data of res.data) {

            let repair_data: any = {
              name: (result_data.prdNm) ? String(result_data.prdNm._text) : "Not found",
              sku: (result_data.prdNo) ? String(result_data.prdNo._text) : "Not found",
              barcode: (result_data.prdNo) ? String(result_data.prdNo._text) : "Not found",
              price_purchase: (result_data.selPrc) ? Number(result_data.selPrc._text) : 0,
              price_sale: (result_data.selPrc) ? Number(result_data.selPrc._text) : 0,
              description: (result_data.htmlDetail) ? String(result_data.htmlDetail._text) : "Not found",
              qty: (result_data.prdSelQty) ? Number(result_data.prdSelQty._text) : 0,
              image: (result_data.prdImage01) ? String(result_data.prdImage01._text) : "Not found",
              image_string: (result_data.prdImage01) ? String(result_data.prdImage01._text) : "Not found"
            };

            // progressive framework

            // result_data.repair_data = repair_data
            repair_data_arr.push(repair_data)

            res.data = repair_data_arr

            let createParams: any = {
              ...repair_data,
              user: { // ngikutin DTO yang di insert cuma userId   / kalo rawSQL ga perlu
                id: 1
              }
            }


          } // end for

          return res;
        }))

  }

  async CreateroductMarketplaceElevenia(createProductManualQueryDto: CreateProductManualQueryDto) { // sementara biar cepet


    let checkData: any = 0


    if (createProductManualQueryDto.barcode) {
      checkData = await this.PostgreSqlConnection.query(`SELECT * FROM product WHERE barcode = '${createProductManualQueryDto.barcode}'`)
    }

    // let checkData: any = await this.productRepo.findOne({ barcode: createProductManualQueryDto.barcode })

    if (checkData.length == 0 ){
      let query = `INSERT INTO product(
        name,
        sku,
        barcode,
        price_purchase,
        price_sale,
        description,
        qty,
        image,
        image_string,
        create_at,
        update_at)
      VALUES (
        '${createProductManualQueryDto.name}',
        '${createProductManualQueryDto.sku}',  
        '${createProductManualQueryDto.barcode}', 
        ${createProductManualQueryDto.price_purchase},
        ${createProductManualQueryDto.price_sale},
        '${createProductManualQueryDto.description}', 
        ${createProductManualQueryDto.qty}, 
        '${createProductManualQueryDto.image}', 
        '${createProductManualQueryDto.image_string}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
        )
      `
    let process: any = await this.PostgreSqlConnection.query(query)
    }
   


    // process = await this.productRepo.save(createProductManualQueryDto)


    return process
  }


  async SyncProductMarketplaceElevenia(req_body: any) { // ASYNC AWAIT RXJS 8


    //     // https://rxjs.dev/deprecations/subscribe-arguments
    //     let GetData = await https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    //     return this.httpService.post(`${process.env.OPENAPI_MARKETPLACE_ELEVENIA_URL}/elevenia/get-product-list`, params).subscribe
    //       ({
    //         next: (v) => console.log(v),
    //         error: (e) => console.error(e),
    //         complete: () => console.info('complete')
    //       })



    // https://rxjs.dev/deprecations/to-promise
    // https://stackoverflow.com/questions/68939645/topromise-and-lastvaluefrom-in-rxjs
    // https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated (solved)



    // async await http request backend PROGRESSIVE FRAMEWORK
    // import { HttpService } from '@nestjs/axios';
    // import { map, Observable } from 'rxjs';
    // import { lastValueFrom } from 'rxjs';


    let getData: any = await lastValueFrom(this.GetProductMarketplaceElevenia()) // RxJs versi 7 ++ ( toPromise() is deprecated )

    if (getData.statusCode == 1) {

      for (let i_a = 0; i_a < getData.data.length; i_a++) {

        let createParams = {
          ...getData.data[i_a]
        }

        let createData: any = await this.CreateroductMarketplaceElevenia(createParams)

      } // end for

    } // end if


    return getData

  }


  // ========================== /HTTP REQUEST ASYNC AWAIT USING RXJS 8 (PROGRESSIVE BACKEND FRAMEWORK)
  //=================== MANUAL QUERY
}
