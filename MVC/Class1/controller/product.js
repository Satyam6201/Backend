const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const products = data.products;

exports.createProduct = (req, res) => {
    console.log(req.body);
    products.push(req.body);
    res.status(201).json(req.body);
};

exports.getProduct = (req, res) => {
    res.json(products);
};

exports.getProductById = (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const product = products.find(p => p.id === id);   // used to find id
    res.json(product);
};

exports.updateAllFeatureProduct = (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    products.splice(productIndex, 1, {...req.body, id: id});
    res.status(201).json();
}

exports.updateSomeFeatureProduct = (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    const product = products[productIndex];
    products.splice(productIndex, 1, {...product, ...req.body});
    res.status(201).json();
}

exports.deleteProduct = (req, res) => {
    const id = +req.params.id;  //+ is used to convert number to string
    const productIndex = products.findIndex(p => p.id === id);   // used to find id
    const product = products[productIndex]
    products.splice(productIndex, 1);
    res.status(201).json(product);
}