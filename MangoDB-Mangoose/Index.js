const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const server = express();
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// db Connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  console.log('Database Connected')
}


//bodyParser
server.use(express.json());
server.use(morgan('default'));
server.use(express.static('public'));
server.use('/products',productRouter.router);
server.use('/users',userRouter.router);

server.listen(8080, () => {
  console.log('server started');
});

// Satyam62
// mongodb+srv://satyamkmishraa:<Satyam62>@cluster0.3huxq3l.mongodb.net/?appName=Cluster0