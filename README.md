# RESTful Web API with Node.js Framework

## Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

This uses [ExpressJS](https://expressjs.com) which will be installed when running `npm install`. See configuration section below.

### Configuring your project

- Install requirements

```
npm install 
```

- Run server

```
npm run dev
```

This will run the server on `http://localhost:8000` and automatically generate first genesis block.

### Endpoints

#### Get Block Endpoint

To get get block at _n_ height 
```
curl "http://localhost:8000/block/n"
```

#### Post Block Endpoint

```
curl -X "POST" "http://localhost:8000/block" \
  -H 'Content-Type: application/json' \
  -d $'{
    "body": "Testing block with test string data"
  }'
```