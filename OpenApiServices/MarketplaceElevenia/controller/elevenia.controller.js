let axios = require('axios').default
let moment = require('moment-timezone');
let elevenia_product_function = require('../functions/elevenia-product.function');
let elevenia_order_function = require('../functions/elevenia-order.function');

exports.getOpenApiKey = async (req,res) => { 
    let res_json = await elevenia_product_function.getOpenApiKey(req.body);
    res.json(res_json);
}


// =================== PRODUCT 
exports.getProductListAll = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductListAll(req.body);
    res.json(res_json);
}

exports.getProductList = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductList(req.body);
    res.json(res_json);
}

exports.getProductDetail = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductDetail(req.body);
    res.json(res_json);
}

exports.getProductCategoryList = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductCategoryList(req.body);
    res.json(res_json);
}

exports.getProductCategoryListByParentCategory = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductCategoryListByParentCategory(req.body);
    res.json(res_json);
}

exports.getProductAttributeListByParentCategory = async (req,res) => { 
    let res_json = await elevenia_product_function.getProductAttributeListByParentCategory(req.body);
    res.json(res_json);
}

exports.createProduct = async (req,res) => { 
    let res_json = await elevenia_product_function.createProduct(req.body);
    res.json(res_json);
}
// =================== / PRODUCT 


// =================== ORDER

exports.getOrderList = async (req,res) => { 
    let res_json = await elevenia_order_function.getOrderList(req.body);
    res.json(res_json);
}
// =================== / ORDER