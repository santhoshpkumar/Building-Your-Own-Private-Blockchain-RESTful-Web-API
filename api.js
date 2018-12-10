const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain')
const Block = require('./block')

// App setup
const app = express();


// Parse incoming requests
app.use(bodyParser.json({type: '*/*'}));

// Routes
app.get('/block/:block', (req, res, next) => {
    let block = Blockchain.getBlock(req.params.block)
    block.then(function(result) {
      res.send(JSON.parse(result));
    })
    .catch (error => {
      res.status(404).json({
        "status": 404,
        "message": "Block not found"
      })
    })
});

app.post('/block', (req, res) => {

  if (req.body === undefined || req.body.body === '' || req.body.body === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Fill the body parameter"
    })
  }else{
    console.log(req.body.body)
    let add = Blockchain.addBlock(new Block(req.body.body))
    add.then(function(result) {
      res.status(201).send(result);
    })
    .catch (error => {
      res.status(400).json({
        "status": 400,
        "message": "Unknown error block could not be added"
      })
    })
  }
});


// Server setup
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on port ", port);
