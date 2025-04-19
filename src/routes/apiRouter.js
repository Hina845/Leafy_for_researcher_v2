import express from 'express';

import { getContentCards, getSearchValue, getPostForEdit } from '../controllers/apiController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const apiRouter = express.Router();

apiRouter.post('/get-content-card', getContentCards);

apiRouter.get('/get-search-value', getSearchValue);

apiRouter.get('/fetch-post-for-edit', verifyToken, getPostForEdit);


export default apiRouter;