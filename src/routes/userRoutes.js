import express from 'express';
import { userLogin, userCreate, userLogout } from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userCreate);

userRouter.post('/login', userLogin);

userRouter.get('/logout', verifyToken, userLogout);
