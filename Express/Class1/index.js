const express = require('express');
const fs = require('fs');
const { type } = require('os');

const index = fs.readFileSync('index.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const products = data.products;

const server = express();  // to create server

// server.get('/', (req, res) => {
//     // res.send("Server is Started"); // send http response 
//     // res.sendFile('./Class1/index.html')  // send file 
//     res.json(products);  // send json data 
// })


// Middleware 

server.use(express.json());   // body Parser
server.use(express.static('public')); // serves static assets such as HTML files, images, and so on.

server.use((req, res, next) => {
    console.log(req.method, req.ip, req.hostname);
    next();  // move to next step
});



const auth = (req, res, next) => {
    console.log(req.query);

    // if (req.query.password === '123') {
    //     next();
    // }

    if (req.body.password === '123') {
        next();
    }
    else {
        res.sendStatus(401);
    }
}

// server.use(auth);  // globaly used middleware

// Server  Route
server.get('/', auth, (req, res) => {
    res.json({ type: 'Get'});
});

server.post('/', auth, (req, res) => {
    res.json({ type: 'Post'});
});

server.put('/', auth, (req, res) => {
    res.json({ type: 'Put'});
});

server.patch('/', auth, (req, res) => {
    res.json({ type: 'Patch'});
});

server.delete('/', auth, (req, res) => {
    res.json({ type: 'Delete'});
});


server.listen(8080, () => {
    console.log("Server Started")
});