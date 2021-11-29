##  DOCUMENTATION

## 1. installation Docker, Postgresql
```bash
install vm alpine + docker
https://github.com/EKI-INDRADI/eki-latihan-vm-alpine-docker-portable

install Docker, Postgresql
https://github.com/EKI-INDRADI/eki-latihan-docker-postgresql

create database rnd_product_services
```

## 2. install nodejs nodemon & nestjs

```bash
install nodejs   (https://nodejs.org)

npm i -g nodemon

npm i -g @nestjs/cli
nest --version
```


## 3. ExpressJs API ENV (OpenApiServices/MarketplaceElevenia)

```bash

TEST_HOST='http://api.elevenia.co.id/rest'
TEST_API_KEY='721407f393e84a28593374cc2b347a98'

LIVE_HOST='http://api.elevenia.co.id/rest'
LIVE_API_KEY='721407f393e84a28593374cc2b347a98'

PORT='3200'
```

## 4 NestJS API ENV (ProductServices)

```bash
POSTGRESQL_HOST = '127.0.0.1'
POSTGRESQL_PORT = '5400'
POSTGRESQL_USER = 'postgres'
POSTGRESQL_PASSWORD = 'masuk123'
POSTGRESQL_DATABASE = 'rnd_product_services'
JWT_SECRET_KEY= 'eki-secret-key'
OPENAPI_MARKETPLACE_ELEVENIA_URL = 'http://127.0.0.1:3200'
```

## 5 Running Express API (OpenApiServices/MarketplaceElevenia)

```bash
npm run start:nodemon

Note : 

running port 127.0.0.1:3200
```

## 6 Running NestJs API (ProductServices)

```bash
npm run start:dev

Note : 

running port 127.0.0.1:3001

backend progressive framework (angular pattern)
Database  autogenerate (tidak perlu buat model manual)
Swagger autogenerate (tidak perlu buat swagger manual)
auto validation (tidak perlu buat validasi manual)
```

## 7 Documentation Express API (POSTMAN) (OpenApiServices/MarketplaceElevenia)

```bash
./Documentation/
SELF PROJECT - ELEVENIA -  ALL.postman_collection
SELF PROJECT - ELEVENIA -  ELEVENIA API ONLY.postman_collection
SELF PROJECT - ELEVENIA - EXPRESS API  ONLY.postman_collection
```

## 8 Documentation NestJs API (SWAGGER) (ProductServices)

```bash
http://localhost:3001/product-api-docs
```

## EKI NOTE :

api elevenia bermasalah , hanya bisa menggunakan get request saja
untuk manipulasi data api nya bermasalah, parameter sudah mengikuti request XML Post yang di wajibkan dan seluruh paramter
dari dokumentasi tetapi masih bermasalah (lihat pada testing video api elevenia)

kemungkinan karena dokumentasi tahun 2015 ( tidak update ) , dan mungkin juga karena API_KEY
belum mendapatkan izin dari pihak elevenia untuk proses manipulasi data baik itu order/product

get request order tidak dibuat api karena datanya kosong ( lihat pada testing elevenia api dan express api


## EKI INDRADI

"TIME > KNOWLEDGE > MONEY"