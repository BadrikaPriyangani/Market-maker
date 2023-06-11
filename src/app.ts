import express from 'express';
import { calculateAverageMidPrice, addExchange } from './controllers/calculateAverage.controller';
import { router } from './routers';

const app = express();
const port = 3000;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
