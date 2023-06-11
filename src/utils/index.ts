import { ExchangeData, OrderBookEntry } from "../types";

export function mapToOrderBook(bidOrAskList: any): OrderBookEntry[] {
    let orderBookList: OrderBookEntry[] = [];
    try {
        if (Array.isArray(bidOrAskList)) {
            orderBookList = bidOrAskList.map(element => {
                const order: OrderBookEntry = {
                    price: element["0"],
                    quantity: element["1"]
                }

                return order;
            });
        }
        return orderBookList;

    } catch (error) {
        console.log(`Error mapping to order-book: ${error}`);
        return orderBookList;
    }
}


export function updateOrderBook(exchange: ExchangeData, orderBookUpdate: any, exchangeList: ExchangeData[]) {

    try {
        const { a, b } = orderBookUpdate;
        exchange.orderBook.asks = mapToOrderBook(a);
        exchange.orderBook.bids = mapToOrderBook(b);

        const index = exchangeList.findIndex((entry) => entry.name === exchange.name);

        if (index !== -1) {
            exchangeList.splice(index, 1);
        }

        exchangeList.push(exchange);
    } catch (error) {
        console.log(`Error updating order-book: ${error}`);
    }
}