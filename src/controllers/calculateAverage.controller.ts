import { WebSocket } from 'ws';
import { ExchangeData, OrderBook, WebSocketConnection } from '../types';
import { updateOrderBook } from '../utils';


const connections: WebSocketConnection[] = [];
export const exchanges: ExchangeData[] = [];

export function addExchange(exchangeName: string, webSocketUrl: string) {

    const orderBook: OrderBook = { bids: [], asks: [] };
    const exchange: ExchangeData = { name: exchangeName, orderBook };

    //This excludes kraken and huobi for the moment due to come difficulties
    if (exchangeName.toLowerCase() !== 'kraken' && exchangeName.toLowerCase() !== 'huobi') {

        try {
            //Create new WebSocket connection
            const socket = new WebSocket(webSocketUrl);
            const connection: WebSocketConnection = { exchange, socket };
            connections.push(connection);

            socket.on('open', () => {
                console.log(`WebSocket connection opened for ${exchangeName}`);
            });

            //Update order-book with the taken data
            socket.on('message', (data) => {
                try {
                    const orderBookUpdate = JSON.parse(data.toString());
                    updateOrderBook(exchange, orderBookUpdate, exchanges);
                } catch (error) {
                    console.log(`Error parsing WebSocket message: ${error}`);
                }
            });

            socket.on('close', () => {
                const conn = connections.filter((conn) => conn.exchange.name !== exchangeName);
                console.log(`WebSocket connection closed for ${exchangeName}`);
            });

            socket.on('error', (error) => {
                console.log(`WebSocket connection error for ${exchangeName}: ${error}`);
            });

        } catch (error) {
            console.log(`Error creating WebSocket connection for ${exchangeName}: ${error}`);
        }
    } else {
        // For kraken and huobi, it access a pre-defined data file for the moment (extendable for any future added exchanges)
        const fs = require('fs');
        const fileName = exchangeName.toLowerCase() + "_data.json";
        const path = require('path');
        const filePath = path.resolve("src/data/", fileName);

        fs.readFile(filePath, 'utf8', (err: Error, jsonString: string) => {
            if (err) {
                console.log('Error reading JSON file:', err);
                return;
            }

            try {
                // Parse the JSON data
                const data = JSON.parse(jsonString);
                updateOrderBook(exchange, data, exchanges);
            } catch (error) {
                console.log('Error parsing the JSON data:', error);
            }
        });

    }
}

//Calculate mid price with highest bid and lowest ask
export function calculateMidPrice(orderBook: OrderBook): number {
    try {

        if (orderBook.bids.length === 0 || orderBook.asks.length === 0 ) {
            return 0;
        }
         
        //Sorted data gives the highset bid as the first element and the lowest ask as the first element
        const highestBid = orderBook.bids[0].price;
        const lowestAsk = orderBook.asks[0].price;
        
        if (Number.isNaN(highestBid) || Number.isNaN(lowestAsk)) {
            throw new Error('Highest bid or lowest ask is not a number');
        }
        
        const midPrice = (parseFloat(highestBid) + parseFloat(lowestAsk)) / 2;
        return midPrice;

    } catch (error) {
        console.log(`Error calculating MidPrice: ${error}`);
        return 0;
    }

}

//Calculate average mid price : summing all the mid prices and dividing the sum by the number of exchanges
export function calculateAverageMidPrice(): number {
    try {
        const totalMidPrice = exchanges.reduce((total, exchange) => {
            const midPrice = calculateMidPrice(exchange.orderBook);
            return total + midPrice;
        }, 0);

        const averageMidPrice = totalMidPrice / exchanges.length;

        if (isNaN(averageMidPrice)) {
            throw new Error('Average mid price is not a number');
        }

        console.log("Returning average mid price");
        return averageMidPrice;

    } catch (error) {
        console.log(`Error calculating MidPrice: ${error}`);
        return 0;
    }

}


