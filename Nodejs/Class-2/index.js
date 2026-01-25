const http = require('http');
const fs = require('fs'); // fs = File System

const index = fs.readFileSync('index.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const products =  data.products;


const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    if(req.url.startsWith('/product')){
    const id = req.url.split('/')[2]
    const product = products.find(p=>p.id===(+id))
    console.log(product)
    res.setHeader('Content-Type', 'text/html');
          let modifiedIndex = index.replace('**title**', product.title)
          .replace('**url**', product.thumbnail)
          .replace('**price**', product.price)
          .replace('**rating**', product.rating)
          res.end(modifiedIndex);
          return;
  }    

    switch (req.url) {
        case '/':
            res.setHeader('Content-Type', 'text/html');
            res.end(index);
            break;
        
        case '/api':
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data));
            break;
        
         case '/products':
            res.setHeader('Content-Type', 'text/html');
            let modifiedIndex = index.replace('**title**', products.title)
            .replace('**rating**', products.rating)
            .replace('**url**"', products.thumbnail)
            .replace('**price**', products.price)
            res.end(modifiedIndex);
            break;
    
        default:
            res.writeHead(404, "Not Found");
            res.end();
            break;
    }
    
    console.log("server started");
    // res.setHeader('Dummy', 'DummyValue');

    // res.setHeader('Content-Type', 'text/html');
    // res.end(index);

    // res.setHeader('Content-Type', 'application/json')
    // res.end(data);

});

server.listen(8080);