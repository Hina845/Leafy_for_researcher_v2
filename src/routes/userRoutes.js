import express from 'express';
import { userLogin, userCreate } from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userCreate);

userRouter.post('/login', userLogin);

export default userRouter;