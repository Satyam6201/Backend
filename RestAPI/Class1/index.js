const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const products = data.products;

const express = require('express');
const morgan = require('morgan');
const { type } = require('os');
const server = express();

//bodyParser
server.use(express.json());
server.use(morgan('default'))
server.use(express.static('public'));




// C R U D (Create, Read, Update, Delete)

//Create POST / products   
server.post("/products", (req, res) => {
    console.log(req.body);
    products.push(req.body);
    res.status(201).json(req.body);
});

// Read GET /products
server.get("/products", (req, res) => {
    res.json(products);
});

// Read GET /products/:id
server.get("/products/:id", (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const product = products.find(p => p.id === id);   // used to find id
    res.json(product);
});

// Update PUT /products/:id
server.put("/products/:id", (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    products.splice(productIndex, 1, {...req.body, id: id});
    
    res.status(201).json();
});

// Update PATCH /products/:id
server.patch("/products/:id", (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    const product = products[productIndex];
    products.splice(productIndex, 1, {...product, ...req.body});
    
    res.status(201).json();
});

// Delete DELETE /products/:id
server.delete("/products/:id", (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    const product = products[productIndex]
    products.splice(productIndex, 1);
    res.status(201).json(product);
});


server.listen(8080, () => {
  console.log('server started');
});