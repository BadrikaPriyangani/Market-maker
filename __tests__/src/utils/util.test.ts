import { ExchangeData } from '../../../src/types';
import { mapToOrderBook, updateOrderBook } from '../../../src/utils';

describe('mapToOrderBook', () => {
  //Success case
  test('should map bid or ask list to OrderBookEntry array', () => {
    const input = [
      ['16978.16', '0.20981'],
      ['16977.86', '0.00015'],
    ];
    const expectedOutput = [
      { price: '16978.16', quantity: '0.20981' },
      { price: '16977.86', quantity: '0.00015' },
    ];
    const result = mapToOrderBook(input);
    expect(result).toEqual(expectedOutput);
  });

  //Error cases
  test('should return an empty array for an empty input', () => {
    const result = mapToOrderBook([]);
    expect(result).toEqual([]);
  });

  test('should skip non-array inputs and return an empty array', () => {
    const input = 'invalid input';
    const result = mapToOrderBook(input);
    expect(result).toEqual([]);
  });


});

describe('updateOrderBook', () => {
  let exchange: ExchangeData;
  let orderBookUpdate: any;
  let exchangeList: ExchangeData[];

  beforeEach(() => {
    exchange = {
      name: 'Binance',
      orderBook: {
        bids: [],
        asks: [],
      },
    };
    orderBookUpdate = {
      a: [
        ['16978.28', '0.03842'],
        ['16978.30', '0.36986'],
      ],
      b: [
        ['16978.16', '0.20981'],
        ['16977.86', '0.00015'],
      ],
    };
    exchangeList = [];
  });

  //Success cases
  test('should update the order book asks and bids', () => {
    updateOrderBook(exchange, orderBookUpdate, exchangeList);

    expect(exchange.orderBook.asks).toEqual([
      { price: '16978.28', quantity: '0.03842' },
      { price: '16978.30', quantity: '0.36986' },
    ]);
    expect(exchange.orderBook.bids).toEqual([
      { price: '16978.16', quantity: '0.20981' },
      { price: '16977.86', quantity: '0.00015' },
    ]);
  });

  test('should update the exchange in the exchange list', () => {
    exchangeList.push(exchange);

    updateOrderBook(exchange, orderBookUpdate, exchangeList);

    expect(exchangeList.length).toBe(1);
    expect(exchangeList[0]).toBe(exchange);
  });

  test('should remove the existing exchange from the exchange list', () => {
    const existingExchange: ExchangeData = {
      name: 'Binance',
      orderBook: {
        bids: [],
        asks: [],
      },
    };
    exchangeList.push(existingExchange);

    updateOrderBook(exchange, orderBookUpdate, exchangeList);

    expect(exchangeList.length).toBe(1);
    expect(exchangeList[0]).toBe(exchange);
  });
});
