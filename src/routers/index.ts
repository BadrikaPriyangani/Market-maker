import { Router } from "express";
import { addExchange, calculateAverageMidPrice } from "../controllers/calculateAverage.controller";

export const router = Router();

/**
 * [POST] /api/exchanges
 *
 * Description: Create and sync up to date record-books in exchanges
 *
 * Request:
 * - Body: 
 *  [
 *      {
 *          "exchangeName": "Binance",
 *           "webSocketUrl": "wss://stream.binance.com:9443/ws/btcusdt@depth"
 *      },
 *      {
 *         "exchangeName": "Kraken",
 *          "webSocketUrl": "wss://ws.kraken.com"
 *      },
 *      {
 *          "exchangeName": "Huobi",
 *          "webSocketUrl": "wss://api.huobi.pro/ws"
 *      }
 *  ]
 *
 * Response:
 * - Status Code: [200,400,500]
 * - Body: {"success": "Order Book sync success"}
 *
 * Errors:
 * - [Error 1]: [Invalid request body: 400]
 * - [Error 2]: [Invalid exchange configuration: 400]
 * - [Error 3]:[Internal server error: 500] 
 */
router.post('/api/exchanges', (req, res) => {
    try {
        const exchangeConfigs = req.body;
        if (!Array.isArray(exchangeConfigs)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        for (const config of exchangeConfigs) {
            const { exchangeName, webSocketUrl } = config;
            if (!exchangeName || !webSocketUrl) {
                console.log(`Invalid exchange configuration: ${JSON.stringify(config)}`);
                return res.status(400).json({ error: 'Invalid exchange configuration' });
                continue;
            }

            addExchange(exchangeName, webSocketUrl);
        }
        res.status(200).json({ success: "Order Book sync success" });

    } catch (error) {
        console.error(`Error creating order book: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * [GET] /api/global-price-index
 *
 * Description: Retrieve global price index (average mid price of several exchanges)
 *
 * Request:
 *
 * Response:
 * - Status Code: [200,500]
 * - Body: {" "averageMidPrice": 25676.175"}
 *
 * Errors:
 * - [Error 1]:[Internal server error: 500] 
 */
router.get('/api/global-price-index', (_, res) => {
    try {
        const averageMidPrice = calculateAverageMidPrice();
        res.status(200).json({ averageMidPrice });
    } catch (error) {
        console.error(`Error retrieving global price index: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});