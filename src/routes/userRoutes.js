import express from 'express';
import { userLogin, userCreate, userLogout } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userCreate);

userRouter.post('/login', userLogin);

userRouter.get('/logout', verifyToken, userLogout);

export default userRouter;