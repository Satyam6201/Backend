const fs = require('fs');
const model = require('../model/product');
const { default: mongoose } = require('mongoose');
const Product = model.product;

// CRUD(Create, Read, Update, Delete)

// Create (post)
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
                
        const doc = await product.save();
        console.log('Data Saved in Compass:', doc);
        
        res.status(201).json(doc);
    } catch (err) {
        console.log('Error saving data:', err);
        res.status(400).json(err);
    }
};

// Read (get)
exports.getProduct = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// Get by id(Read)
exports.getProductById = async (req, res) => {
    const id = req.params.id; 
    const products = await Product.findById(id);   // used to find id
    res.json(products);
};

// Update (put)
exports.updateAllFeatureProduct = async (req, res) => {
    const id = req.params.id; 
    const doc = await Product.findOneAndReplace({ _id: id }, req.body, {new: true});    
    res.status(201).json(doc);
}

// Update Only some things(Patch)
exports.updateSomeFeatureProduct = async (req, res) => {
    const id = req.params.id; 
    const doc = await Product.findOneAndUpdate({ _id: id }, req.body, {new: true});    
    res.status(201).json(doc);
}

// Delete Only some things(Delete)
exports.deleteProduct = async (req, res) => {
    const id = req.params.id; 
    const doc = await Product.findOneAndDelete({ _id: id });    
    res.status(201).json(doc);
}