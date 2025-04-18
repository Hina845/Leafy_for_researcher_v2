import express from 'express';
import { userLogin, userCreate, userLogout, resetPasswordSubmit, resetPassword, getUserInfo } from '../controllers/userController.js';
import { verifyToken, verifyPasswordChangeLink } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userCreate);

userRouter.post('/login', userLogin);

userRouter.post('/reset-password-submit', resetPasswordSubmit);

userRouter.post('/reset-password/', verifyPasswordChangeLink, resetPassword);

userRouter.get('/logout', verifyToken, userLogout);

userRouter.get('/get-user-info', verifyToken, getUserInfo);

export default userRouter;