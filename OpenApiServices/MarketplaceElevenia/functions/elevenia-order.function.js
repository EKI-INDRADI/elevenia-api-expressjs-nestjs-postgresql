
let error_detail = require('./tools/try_catch_error_detail');
let request_validation = require('./tools/request_validation');
let cfg = require("../config/elevenia.config");
let axios = require('axios').default
const fs = require('fs');
let convertXML2JSON = require('xml-js');
require('dotenv').config();

exports.getOrderList = async (req_body_origin) => {

    let res_json = {};
    let req_body = JSON.parse(JSON.stringify(req_body_origin));

    let req_body_limit = 10

    try {

        let dataRequest = {

        }

        let dateForm = new Date(req_body.dateForm).getFullYear() + "/"
            + ("0" + (new Date(req_body.dateForm).getMonth() + 1)).slice(-2) + "/"
            + ("0" + new Date(req_body.dateForm).getDate()).slice(-2)

        let dateTo = new Date(req_body.dateTo).getFullYear() + "/"
            + ("0" + (new Date(req_body.dateTo).getMonth() + 1)).slice(-2) + "/"
            + ("0" + new Date(req_body.dateTo).getDate()).slice(-2)



        let dataResult
        if (req_body.ordStat && req_body.dateForm && req_body.dateTo) {
            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/orderservices/orders?ordStat=${req_body.ordStat}&dateFrom=${dateForm}&dateTo=${dateTo}`,
                data: dataRequest,
                headers: {
                    'Content-Type': 'text/xml',
                    'openapikey': cfg.API_KEY
                }
            })
        } else {
            dataResult = await axios({
                method: 'get',
                url: `${cfg.HOST}/orderservices/orders`,
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
        if (result_json['Orders']) {
            generate_template_json = (result_json['Orders'] && typeof result_json['Orders']  == "object") ? [] : result_json['Orders']
        } else {
            generate_template_json = []
        }



        // =================================== /TEMPLATE
        // =================================== /CONVERT JSON


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
        console.log('function elevenia.getProductList, error : ' + error.message);
        error_detail.try_catch_error_detail(error);

        res_json.statusCode = 0;
        res_json.message = error.message;

        return res_json;
    }


}
