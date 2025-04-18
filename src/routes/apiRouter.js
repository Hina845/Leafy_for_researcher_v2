import express from 'express';

import { getContentCards, getSearchValue } from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.post('/get-content-card', getContentCards);

apiRouter.get('/get-search-value', getSearchValue);

export default apiRouter;