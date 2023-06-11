import { calculateAverageMidPrice, calculateMidPrice } from '../../../src/controllers/calculateAverage.controller';
import { exchanges } from "../../../src/controllers/calculateAverage.controller";
import { ExchangeData } from '../../../src/types';

describe('calculateMidPrice', () => {
  //Success case
  test('should return the mid-price when the order book has bids and asks', () => {
    const orderBook = {
      bids: [
        { price: '16978.16', quantity: '0.20981' },
        { price: '16977.86', quantity: '0.00015' },
      ],
      asks: [
        { price: '16978.28', quantity: '0.03842' },
        { price: '16978.30', quantity: '0.36986' },
      ],
    };

    const midPrice = calculateMidPrice(orderBook);

    expect(midPrice).toBe(16978.22);
  });

  //Error cases
  test('should return 0 when the order book is empty', () => {
    const orderBook = {
      bids: [],
      asks: [],
    };

    const midPrice = calculateMidPrice(orderBook);

    expect(midPrice).toBe(0);
  });

  test('should return 0 when the order book has bids but no asks', () => {
    const orderBook = {
      bids: [
        { price: '16978.16', quantity: '0.20981' },
        { price: '16977.86', quantity: '0.00015' },
      ],
      asks: [],
    };

    const midPrice = calculateMidPrice(orderBook);

    expect(midPrice).toBe(0);
  });

  test('should return 0 when the order book has asks but no bids', () => {
    const orderBook = {
      bids: [],
      asks: [
        { price: '16978.28', quantity: '0.03842' },
        { price: '16978.30', quantity: '0.36986' },
      ],
    };

    const midPrice = calculateMidPrice(orderBook);

    expect(midPrice).toBe(0);
  });

  test('should return NaN when there is a bid that is not a number', () => {
    const orderBook = {
      bids: [
        { price: 'Invalid', quantity: '0.20981' },
        { price: '16977.86', quantity: '0.00015' },
      ],
      asks: [
        { price: '16978.28', quantity: '0.03842' },
        { price: '16978.30', quantity: '0.36986' },
      ],
    };

    const midPrice = calculateMidPrice(orderBook);

    expect(midPrice).toBe(NaN);
  });
});


describe('calculateAverageMidPrice', () => {
  //Success case
  test('should return the average mid-price when exchanges have valid order books', () => {

    const binance: ExchangeData = {

      name: 'Binance',
      orderBook: {
        bids: [
          { price: '16978.16', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: '16978.28', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };

    const kraken: ExchangeData = {

      name: 'Kraken',
      orderBook: {
        bids: [
          { price: '16988.16', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: '16968.28', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };

    const huobi: ExchangeData = {

      name: 'Huobi',
      orderBook: {
        bids: [
          { price: '16998.16', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: '16958.28', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };


    exchanges.push(binance);
    exchanges.push(kraken);
    exchanges.push(huobi);

    const averageMidPrice = calculateAverageMidPrice();

    expect(averageMidPrice).toBe(16978.22);
    exchanges.length = 0;
  });

  //Error cases
  test('should return 0 when exchanges have empty order books', () => {

    const binance: ExchangeData = {

      name: 'Binance',
      orderBook: {
        bids: [],
        asks: [],
      }
    };

    const kraken: ExchangeData = {

      name: 'Kraken',
      orderBook: {
        bids: [],
        asks: [],
      }
    };

    const huobi: ExchangeData = {

      name: 'Huobi',
      orderBook: {
        bids: [],
        asks: [],
      }
    };


    exchanges.push(binance);
    exchanges.push(kraken);
    exchanges.push(huobi);

    const averageMidPrice = calculateAverageMidPrice();

    expect(averageMidPrice).toBe(0);
    exchanges.length = 0;
  });

  test('should throw an error when average mid-price is NaN', () => {

    const binance: ExchangeData = {

      name: 'Binance',
      orderBook: {
        bids: [
          { price: 'Invalid', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: '16978.28', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };

    const kraken: ExchangeData = {

      name: 'Kraken',
      orderBook: {
        bids: [
          { price: '16988.16', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: 'Invalid', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };

    const huobi: ExchangeData = {

      name: 'Huobi',
      orderBook: {
        bids: [
          { price: '16998.16', quantity: '0.20981' },
          { price: '16977.86', quantity: '0.00015' },
        ],
        asks: [
          { price: '16958.28', quantity: '0.03842' },
          { price: '16978.30', quantity: '0.36986' },
        ],
      }
    };


    exchanges.push(binance);
    exchanges.push(kraken);
    exchanges.push(huobi);

    const averageMidPrice = calculateAverageMidPrice();
    expect(averageMidPrice).toBe(0);
    exchanges.length = 0;
  });
});