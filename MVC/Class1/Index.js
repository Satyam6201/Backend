const express = require('express');
const morgan = require('morgan');
const server = express();
const productController = require("./controller/product");

// Adding router
const productRouter = express.Router();

//bodyParser
server.use(express.json());
server.use(morgan('default'))
server.use(express.static('public'));
server.use('/', productRouter);

// MVC(Model View  Controller)
//Create POST / products   
server
    .post("/products", productController.createProduct)
    .get("/products", productController.getProduct)
    .get("/products/:id", productController.getProductById)
    .put("/products/:id", productController.updateAllFeatureProduct)
    .patch("/products/:id", productController.updateSomeFeatureProduct)
    .delete("/products/:id", productController.deleteProduct);


server.listen(8080, () => {
  console.log('server started');
});