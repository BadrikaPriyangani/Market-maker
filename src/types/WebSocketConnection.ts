import { WebSocket } from 'ws';
import { ExchangeData } from "./ExchangeData";

export type WebSocketConnection = {
  exchange: ExchangeData;
  socket: WebSocket;
}