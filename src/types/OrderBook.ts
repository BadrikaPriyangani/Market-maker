import { OrderBookEntry } from "./OrderBookEntry";

export type OrderBook = {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}