# Market Maker

This project is a simple implementation of using orderbook data provided by exchanges and computing them to have a fair mid-price.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [RoadMap](#roadmap)

## Getting Started

To run the Market Maker application, you need to have Node.js and TypeScrypt installed on your machine. Clone the repository and navigate to the project root directory.

## Installation

To run the Market Maker app, use following commands:

```
npm install
```
This will install all the dependencies required for the app mentioned in the package.json file. And there will be a folder created as node_modules.

```
node index
```
This will run the application and now listening to port for incoming requests.

## API Documentation

If the curl commands are preffered:
```
curl -X POST -H "Content-Type: application/json" -d '[{"exchangeName":"Binance","webSocketUrl":"wss://stream.binance.com:9443/ws/btcusdt@depth"},{"exchangeName":"Kraken","webSocketUrl":"wss://ws.kraken.com"},{"exchangeName":"Huobi","webSocketUrl":"wss://api.huobi.pro/ws"}]' http://localhost:3000/api/exchanges
```
This will create and sync exchange data taken from the web socket

```
curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/global-price-index
```
This will retrieve the average mid price of the exchanges

If the Postman is preffered:

1. POST request:
http://localhost:3000/api/exchanges

with request body:
[
  {
    "exchangeName": "Binance",
    "webSocketUrl": "wss://stream.binance.com:9443/ws/btcusdt@depth"
  },
  {
    "exchangeName": "Kraken",
    "webSocketUrl": "wss://ws.kraken.com"
  },
  {
    "exchangeName": "Huobi",
    "webSocketUrl": "wss://api.huobi.pro/ws"
  }
]

Response:

Success:
 "Order Book sync success" :200
 
 Error:
 - Invalid request body: 400
 - Invalid exchange configuration: 400
 - Internal server error: 500
 

2. GET Request
http://localhost:3000/api/global-price-index

Response:

Success:
 "averageMidPrice": "25676.175" :200
 
 Error:
 - Internal server error: 500


## Testing

To run the tests, install jest:
```
npm install --save-dev typescript jest ts-jest @types/jest
```

Run the tests:
```
npm test
```

## RoadMap
 
 - [ ] Extend the application to fetch Kraken and Huobi record books. 
 Here we have to send a subscription message after the web socket connection is created, to fetch the order book data.
 Example: 
 ```
 socket.on('open', () => {
  console.log('WebSocket connection opened for Kraken');
  
  // Subscribe to order book updates for the BTC/USDT trading pair
  socket.send(JSON.stringify({
    event: 'subscribe',
    pair: 'BTC/USDT',
    subscription: {
      name: 'book',
    },
  }));
});
```
Reffer to official API documentation for more info : https://docs.kraken.com/websockets/

 - [ ] Implement a logger like winston or pino to write the logs to a file.
 - [ ] Improve testing with mocking to test the API end points (by mocking the web socket connection) 





