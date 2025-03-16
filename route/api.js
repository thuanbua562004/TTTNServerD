const express = require('express');
const APIController = require('../controller/ApiController');
const router = express.Router();

const apiUser = (app) => {
    ///API USER 
    router.get('/user', APIController.getUser);
    router.post('/user', APIController.createUser);
    router.put('/user', APIController.updateUser);
    router.delete('/user/:id', APIController.deleteUser);
    // API PRODUCT
    router.get('/product', APIController.getListProduct);
    router.get('/product/:id', APIController.getProductDetail);
    router.post('/product', APIController.createProduct);
    router.delete('/product/:id', APIController.deleteProduct);
    router.put('/product', APIController.updateProduct);
    router.put('/updatequantity', APIController.updateQuantity);

    // API PRODUCT
    router.post('/cart', APIController.getListCart);
    // API NOTIFI 
    router.get('/notifi', APIController.getNoitfi);
    // router.delete('/delete-product/:id', APIController.deleteProduct);

    // Api Cart 
    router.post('/add-cart', APIController.addCart);
    router.put('/update-cart', APIController.updateCart);
    router.delete('/delItems-cart', APIController.delItemCart);
    router.delete('/del-cart', APIController.deleteCart);

    //Api HistoryBuy 
    router.get('/buy', APIController.getHistory);
    router.get('/buy/:id', APIController.getHistoryUser);
    router.put('/buy', APIController.updateStatus);
    router.post('/buy', APIController.addCHistoryBuy);
    
    // API VOUCEHR 
    router.post('/voucher', APIController.addVoucher);
    router.get('/voucher/:id', APIController.getVoucher);

    //API COMMENTS
    router.post('/comment', APIController.addComment);
    router.get('/comment/:id', APIController.getComment);
    router.delete('/comment', APIController.deleteComment);
    
    // Api Categorys
    router.get('/category', APIController.getCategory);
    router.post('/category', APIController.addCategory);
    router.delete('/category/:id', APIController.deleteCategory);


    app.use('/api', router);
};







module.exports = apiUser;
