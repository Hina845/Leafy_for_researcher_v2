import express from 'express';

import { getContentCards } from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.post('/get-content-card', getContentCards);

export default apiRouter;