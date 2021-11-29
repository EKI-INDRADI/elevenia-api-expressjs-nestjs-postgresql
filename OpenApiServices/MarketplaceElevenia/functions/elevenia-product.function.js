
let error_detail = require('./tools/try_catch_error_detail');
let request_validation = require('./tools/request_validation');
let cfg = require("../config/elevenia.config");
let axios = require('axios').default
const fs = require('fs');
let convertXML2JSON = require('xml-js');
require('dotenv').config();

exports.generateFile = async function (data, func_name = "_", note = "_", new_dir) {

    if (!fs.existsSync(__basedir + "/log-files/" + new_dir)) {
        fs.mkdirSync(__basedir + "/log-files/" + new_dir);
    }



    if (data.constructor == Array || data.constructor == Object || data.constructor == String) {

        let text_write = data;


        let directoryPath

        if (new_dir) {
            directoryPath = __basedir + "/log-files/" + new_dir
        } else {
            directoryPath = __basedir + "/log-files/";
        }


        let auto_generate = ("0" + new Date().getDate()).slice(-2) + "-"
            + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-"
            + new Date().getFullYear() + "-"
            + ("0" + new Date().getHours()).slice(-2)
            + ("0" + new Date().getMinutes()).slice(-2)
            + ("0" + new Date().getMilliseconds());


        let text_write_by_file_type;

        let file_type = ".txt";

        try {


            if (text_write == undefined) {
                text_write_by_file_type = String("undefined");
                file_type = ".txt";
            } else if (text_write.constructor == Number) {
                ext_write_by_file_type = String(text_write);
                file_type = ".txt";

            } else if (text_write.constructor == Array || text_write.constructor == Object) {
                text_write_by_file_type = JSON.stringify(text_write).toString();
                file_type = ".json";
            } else if (text_write.constructor == String) {
                text_write_by_file_type = String(text_write);
                file_type = ".txt";
            }

            let console_log
            if (new_dir) {
                console_log = "func createLog, file : " + __basedir + " -> log-files -> " + new_dir + " -> " + auto_generate + "_log_" + func_name + "_" + note + file_type + " saved!"
            } else {
                console_log = "func createLog, file : " + __basedir + " -> log-files -> " + auto_generate + "_log_" + func_name + "_" + note + file_type + " saved!"
            }


            fs.writeFileSync(directoryPath + auto_generate + "_log_" + func_name + "_" + note + file_type, text_write_by_file_type, function (err, result) {

                if (err) console.log(err.message);
            });


            let res_json = {
                statusCode: 1,
                message: "func createLog, file : " + __basedir + " -> log-files -> " + auto_generate + "_log_" + func_name + "_" + note + file_type + " saved!"
            }

            if (new_dir) {
                res_json = {
                    statusCode: 1,
                    message: "func createLog, file : " + __basedir + " -> log-files -> " + new_dir + " -> " + auto_generate + "_log_" + func_name + "_" + note + file_type + " saved!"
                }
            }


            return res_json

        } catch (error) {
            console.log(" catch (error) , func createLog, location : helper -> create-log.js , error : " + error.message);

            let res_json = {
                statusCode: 0,
                message: " catch (error) , func createLog, location : helper -> create-log.js , error : " + error.message
            }
            return res_json
        }

    } else {
        console.log("func createLog, data != string/array/object ");
    }

};


exports.getOpenApiKey = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    try {

        console.log(cfg)
        if (cfg.API_KEY) {
            res_json.statusCode = 1
            res_json.openapikey = cfg.API_KEY
        } else {
            res_json.statusCode = 0
            res_json.message = "please defined TEST_API_KEY / LIVE_API_KEY"
        }

        res_json.date = new Date().toISOString()

        return res_json

    } catch (error) {
        console.log('function elevenia.getOpenApiKey, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}
// https://stackoverflow.com/questions/52281389/convert-xml-to-json-with-nodejs/57724779

// https://stackoverflow.com/questions/53058805/how-to-send-xml-data-using-axios-library/53059577


exports.getProductListAll = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    try {

     
        let page_number = 1

        let dataResult

        let dataResultAll = []

        do {
            dataResult = await exports.getProductList({
                page: page_number
            })

            page_number = page_number + 1


            if (dataResult.statusCode == 1 && dataResult.data.length > 0) {

                for (let i_a = 0; i_a < dataResult.data.length; i_a++) {
                    dataResultAll.push({
                        ...dataResult.data[i_a]
                    })
                }

            } 


        } // end do

        while (dataResult.statusCode == 1 && dataResult.data.length > 0)


        if (dataResultAll.length > 0) {
            res_json.statusCode = 1
            res_json.data = dataResultAll
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductListAll, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.getProductList = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    let req_body_limit = 10

    try {

        let dataRequest = {

        }


        let dataResult
        if (req_body.page) {
            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/prodservices/product/listing?page=` + req_body.page,
                data: dataRequest,
                headers: {
                    'Content-Type': 'text/xml',
                    'openapikey': cfg.API_KEY
                }
            })
        } else {
            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/prodservices/product/listing`,
                data: dataRequest,
                headers: {
                    'Content-Type': 'text/xml',
                    'openapikey': cfg.API_KEY
                }
            })
        }


        // =================================== CONVERT JSON
        let result_json = {}

        result_json = JSON.parse(
            convertXML2JSON.xml2json(dataResult.data
                ,
                {
                    compact: true
                    //,
                    // trim: true,
                    // spaces: 4
                }
            )
        )
        // =================================== TEMPLATE
        let generate_template_json
        if (result_json['Products']['product'] || result_json['Product']) {
            generate_template_json = result_json['Products']['product']
        } else {
            generate_template_json = []
        }

        // =================================== /TEMPLATE
        // =================================== /CONVERT JSON


        if (dataResult) {
            res_json.statusCode = 1
            // res_json.total = (generate_template_json.constructor === Array) ? generate_template_json.length : (generate_template_json) ? 1 : 0
            if (req_body.page) {
                res_json.current_page = req_body.page
            }
            res_json.data = (generate_template_json.constructor === Array) ? generate_template_json : [generate_template_json]
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductList, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.getProductDetail = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));


    try {

        let dataRequest = {

        }


        let dataResult = await axios({
            method: 'get',
            url: `${cfg.HOST}/prodservices/product/details/` + req_body.prdNo,
            data: dataRequest,
            headers: {
                'Content-Type': 'text/xml',
                'openapikey': cfg.API_KEY
            }
        })


        // =================================== CONVERT JSON
        let result_json = {}

        result_json = JSON.parse(
            convertXML2JSON.xml2json(dataResult.data
                ,
                {
                    compact: true
                    //,
                    // trim: true,
                    // spaces: 4
                }
            )
        )
        // =================================== TEMPLATE
        let generate_template_json
        if (result_json['Product']) {
            generate_template_json = result_json['Product']
        } else {
            generate_template_json = []
        }
        // generate_template_json = result_json
        // =================================== /TEMPLATE
        // =================================== /CONVERT JSON

        if (dataResult) {
            res_json.statusCode = 1
            // res_json.total = (generate_template_json.constructor === Array) ? generate_template_json.length : (generate_template_json) ? 1 : 0
            if (req_body.page) {
                res_json.current_page = req_body.page
            }
            res_json.data = (generate_template_json.constructor === Array) ? generate_template_json : [generate_template_json]
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductDetail, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.getProductCategoryList = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    try {


        let dataRequest = {

        }
        let dataResult = await axios({
            method: 'get',
            url: `${cfg.HOST}/cateservice/category`,
            data: dataRequest,
            headers: {
                'Content-Type': 'text/xml',
                'openapikey': cfg.API_KEY
            }
        })



        // =================================== CHECK RESULT
        // let generateFile = await exports.generateFile(
        //     String(dataResult.data),
        //     "getProductCategory",
        //     "",
        //     "xml_files/"
        // )
        // =================================== /CHECK RESULT


        // =================================== CONVERT JSON
        let result_json = {}

        result_json = JSON.parse(
            convertXML2JSON.xml2json(dataResult.data
                ,
                {
                    compact: true
                    //,
                    // trim: true,
                    // spaces: 4
                }
            )
        )
        // =================================== TEMPLATE
        // delete result_json._declaration
        // delete result_json['ns2:categorys']._attributes

        generate_template_json = result_json['ns2:categorys']['ns2:category']
        // =================================== /TEMPLATE
        // =================================== /CONVERT JSON


        if (dataResult) {
            res_json.statusCode = 1
            res_json.data = generate_template_json
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductCategory, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.getProductCategoryListByParentCategory = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));
    let result_json = {}

    try {



        let dataRequest = {

        }



        let generate_template_json = []
        let dataResult
        if (req_body.dispCtgrNo) {

            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/cateservice/category/` + req_body.dispCtgrNo,
                data: dataRequest,
                headers: {
                    'Content-Type': 'text/xml',
                    'openapikey': cfg.API_KEY
                }
            })

            // =================================== CONVERT JSON


            result_json = JSON.parse(
                convertXML2JSON.xml2json(dataResult.data
                    ,
                    {
                        compact: true
                        //,
                        // trim: true,
                        // spaces: 4
                    }
                )
            )
            // =================================== TEMPLATE
            generate_template_json = result_json['ns2:categorys']['ns2:category']
            // =================================== /TEMPLATE
            // =================================== /CONVERT JSON

        } // end if




        if (dataResult) {
            res_json.statusCode = 1
            res_json.data = (generate_template_json.constructor === Array) ? generate_template_json : [generate_template_json]
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductCategoryListByParentCategory, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.getProductAttributeListByParentCategory = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    try {

        let dataRequest = {

        }

        let generate_template_json = []
        let dataResult
        let result_json = {}
        if (req_body.dispCtgrNo) {


            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/cateservice/categoryAttributes/` + req_body.dispCtgrNo,
                data: dataRequest,
                headers: {
                    'Content-Type': 'text/xml',
                    'openapikey': cfg.API_KEY
                }
            })

            // =================================== CONVERT JSON

           
            result_json = JSON.parse(
                convertXML2JSON.xml2json(dataResult.data
                    ,
                    {
                        compact: true
                        //,
                        // trim: true,
                        // spaces: 4
                    }
                )
            )

            // =================================== TEMPLATE
            generate_template_json = result_json['ns2:productCtgrAttributes']['ns2:productCtgrAttribute']
            // =================================== /TEMPLATE
            // =================================== /CONVERT JSON

        } // end if




        if (dataResult) {
            res_json.statusCode = 1
            res_json.data = (generate_template_json.constructor === Array) ? generate_template_json : [generate_template_json]
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductAttributeListByParentCategory, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}

exports.createProduct = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    try {


        // https://www.onlineocr.net/
        // https://www.liquid-technologies.com/online-xml-validator
        // https://wiki.xmldation.com/Support/Validator/PseudoAttrNameExpected
        // https://codebeautify.org/xmltojson

        // <?xml version="1.0" encoding="UTF-8">
        // <?xml version="1.0" encoding="UTF-8"?>


        let ex = {
            "selMnbdNckNm": "EKI INRADI TESTING",
            "selMthdCd": "01",
            "dispCtgrNo": 3812,
            "ProductCtgrAttribute": {
                "prdAttrCd": 2000005,
                "prdAttrNm": "EKI TESTING",
                "prdAttrNo": 172259,
                "prdAttrVal": "EKI TESTING Value"
            },
            "prdNm": "EKI TESTING - Do Not Buy This Items",
            "prdStatCd": "01",
            "prdWght": 2,
            "dlvGrntYn": "N",
            "minorSelCnYn": "Y",
            "suplDtyfrPrdClfCd": "01",
            "prdImage01": "<![CDATA[http://soffice.11st.co.kr/img/layout/logo.gif]]>",
            "htmlDetail": "<![CDATA[<p>TEST DETAIL</p>]]>",
            "selPrc": 5000,
            "prdSelQty": 10,
            "asDetail": "Sorry. No after sales service for this product.",
            "rtngExchDetail": "Exchange Returns Information 070-7400-3719"
        }

        // let dataRequest = `<?xml version="1.0" encoding="UTF-8"?>
        // <Product>
        //     <selMnbdNckNm>EKI INRADI TESTING</selMnbdNckNm>
        //     <selMthdCd>01</selMthdCd>
        //     <dispCtgrNo>53</dispCtgrNo>
        //     <ProductCtgrAttribute>
        //         <prdAttrCd>2000042</prdAttrCd>
        //         <prdAttrNm>Neck Style</prdAttrNm>
        //         <prdAttrNo>161075</prdAttrNo>
        //         <prdAttrVal>Neck style Value</prdAttrVal>
        //     </ProductCtgrAttribute>
        //     <prdNm>Test Product - Do Not Buy This Items</prdNm>
        //     <prdStatCd>01</prdStatCd>
        //     <prdWght>Y</prdWght>
        //     <dlvGrntYn>Y</dlvGrntYn>
        //     <minorSelCnYn>Y</minorSelCnYn>
        //     <suplDtyfrPrdClfCd>01</suplDtyfrPrdClfCd>
        //     <prdImage01> <![CDATA[http://soffice.11st.co.kr/img/layout/logo.gif]]> </prdImage01>
        //     <htmlDetail> <![CDATA[<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar vestibulum diem elementum tempus.</p>]]> </htmlDetail>
        //     <asDetail>Sorry. No after sales service for this product.</asDetail>
        //     <rtngExchDetail>Exchange Returns Information 070-7400-3719</rtngExchDetail>
        // </Product>`

        let dataRequest = `<?xml version="1.0" encoding="UTF-8"?>`

        dataRequest = dataRequest +
            `<Product>`

        if (req_body.selMnbdNckNm) { //Nickname
            dataRequest = dataRequest +
                `<selMnbdNckNm>${req_body.selMnbdNckNm}</selMnbdNckNm>`
        }

        if (req_body.selMthdCd) { //Sales Type. ‘01’: Ready Stock ‘04’: Pre­Order  ‘05’: Used Items
            dataRequest = dataRequest +
                `<selMthdCd>${req_body.selMthdCd}</selMthdCd>`
        }

        if (req_body.dispCtgrNo) { //Category ID
            dataRequest = dataRequest +
                `<dispCtgrNo>${req_body.dispCtgrNo}</dispCtgrNo>`
        }

        dataRequest = dataRequest +
            `<ProductCtgrAttribute>`

        if (req_body.ProductCtgrAttribute && req_body.ProductCtgrAttribute.prdAttrCd) {
            dataRequest = dataRequest +
                `<prdAttrCd>${req_body.ProductCtgrAttribute.prdAttrCd}</prdAttrCd>`
        }
        if (req_body.ProductCtgrAttribute && req_body.ProductCtgrAttribute.prdAttrNm) {
            dataRequest = dataRequest +
                `<prdAttrNm>${req_body.ProductCtgrAttribute.prdAttrNm}</prdAttrNm>`
        }
        if (req_body.ProductCtgrAttribute && req_body.ProductCtgrAttribute.prdAttrNo) {
            dataRequest = dataRequest +
                `<prdAttrNo>${req_body.ProductCtgrAttribute.prdAttrNo}</prdAttrNo>`
        }
        if (req_body.ProductCtgrAttribute && req_body.ProductCtgrAttribute.prdAttrVal) {
            dataRequest = dataRequest +
                `<prdAttrVal>${req_body.ProductCtgrAttribute.prdAttrVal}</prdAttrVal>`
        }

        dataRequest = dataRequest +
            `</ProductCtgrAttribute>`

        if (req_body.prdNm) {
            dataRequest = dataRequest +
                `<prdNm>${req_body.prdNm}</prdNm>`
        }

        if (req_body.prdStatCd) {
            dataRequest = dataRequest +
                `<prdStatCd>${req_body.prdStatCd}</prdStatCd>`
        }

        if (req_body.prdWght) {
            dataRequest = dataRequest +
                `<prdWght>${req_body.prdWght}</prdWght>`
        }

        if (req_body.dlvGrntYn) {
            dataRequest = dataRequest +
                `<dlvGrntYn>${req_body.dlvGrntYn}</dlvGrntYn>`
        }

        if (req_body.minorSelCnYn) {
            dataRequest = dataRequest +
                `<minorSelCnYn>${req_body.minorSelCnYn}</minorSelCnYn>`
        }

        if (req_body.suplDtyfrPrdClfCd) {
            dataRequest = dataRequest +
                `<suplDtyfrPrdClfCd>${req_body.suplDtyfrPrdClfCd}</suplDtyfrPrdClfCd>`
        }

        if (req_body.prdImage01) {
            dataRequest = dataRequest +
                `<prdImage01>${req_body.prdImage01}</prdImage01>`
        }

        if (req_body.htmlDetail) {
            dataRequest = dataRequest +
                `<htmlDetail>${req_body.htmlDetail}</htmlDetail>`
        }

        if (req_body.selPrc) {
            dataRequest = dataRequest +
                `<selPrc>${req_body.selPrc}</selPrc>`
        }

        if (req_body.prdSelQty) {
            dataRequest = dataRequest +
                `<prdSelQty>${req_body.prdSelQty}</prdSelQty>`
        }

        if (req_body.asDetail) {
            dataRequest = dataRequest +
                `<asDetail>${req_body.asDetail}</asDetail>`
        }

        if (req_body.rtngExchDetail) {
            dataRequest = dataRequest +
                `<rtngExchDetail>${req_body.rtngExchDetail}</rtngExchDetail>`
        }

        dataRequest = dataRequest +
            `</Product>`



        let generate_template_json = []
        let dataResult = await axios({
            method: 'post',
            url: `${cfg.HOST}/prodservices/product`,
            data: dataRequest,
            headers: {
                'Content-Type': 'application/soap-xml;charset=UTF-8',
                'openapikey': cfg.API_KEY
            }
        })
        // 'Content-Type': 'text/xml',

        // let config = {
        //     headers: {
        //         'Content-Type': 'text/xml',
        //         'openapikey': cfg.API_KEY
        //     }
        // }
        // let dataResult =  await axios.post(`${cfg.HOST}/prodservices/product`, dataRequest, config)


        // 'Content-Type': 'application/xml',
        // 'Content-Type' : 'application/soap-xml;charset=UTF-8'
        // 'Content-Type': 'text/xml',
        // 'Accept-Charset': 'utf-8',
        // 'Content-Encoding' : 'utf-8',



        // =================================== CONVERT JSON

        let result_json = {}
        result_json = JSON.parse(
            convertXML2JSON.xml2json(dataResult.data
                ,
                {
                    compact: true
                    //,
                    // trim: true,
                    // spaces: 4
                }
            )
        )

        // =================================== TEMPLATE
        generate_template_json = result_json
        // =================================== /TEMPLATE
        // =================================== /CONVERT JSON





        if (dataResult) {
            res_json.statusCode = 1
            res_json.data = generate_template_json //(generate_template_json.constructor === Array) ? generate_template_json : [generate_template_json]
            res_json.data_json = result_json
            res_json.data_xml = `${dataResult.data}`
        } else {
            res_json.statusCode = 0
            res_json.message = "Not found"
        }

        return res_json


    } catch (error) {
        console.log('function elevenia.getProductAttributeListByParentCategory, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        if (res_json.message == "Request failed with status code 415") {
            res_json.message = res_json.message + " , EKI NOTE : error 415 dari elevenia sudah mengikuti parameter Mandatory = Y pada dokumentasi UPLOAD (CREATE) (api dokumentasi sudah download terbaru dari elevenia), kemungkinan API_KEY belum mendapatkan ijin untuk create PRODUCT"
        }

        return res_json;
    }


}
