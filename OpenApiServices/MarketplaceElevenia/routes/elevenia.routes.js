let express = require('express');
let router = express.Router();

//controller
const controller = require('../controller/elevenia.controller')

router.get('/', function (req, res) {
    console.log('API ELEVENIA IS RUNNING!');
    res.json({ statusCode: 1, message: 'API ELEVENIA IS RUNNING!' });
});

router.use('/get-openapikey', controller.getOpenApiKey);

// =================== PRODUCT 
router.use('/get-product-list-all', controller.getProductListAll);
router.use('/get-product-list', controller.getProductList);
router.use('/get-product-detail', controller.getProductDetail);
router.use('/get-product-category-list', controller.getProductCategoryList);
router.use('/get-product-category-list-by-parent-category', controller.getProductCategoryListByParentCategory);
router.use('/get-product-attribute-list-by-parent-category', controller.getProductAttributeListByParentCategory);

router.use('/create-product', controller.createProduct);
// =================== / PRODUCT 



// =================== ORDER
router.use('/get-order-list', controller.getOrderList);
// =================== / ORDER

module.exports = router;
