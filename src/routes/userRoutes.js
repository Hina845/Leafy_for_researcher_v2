import express from 'express';
import { userLogin,
         userCreate, 
         userLogout, 
         resetPasswordSubmit, 
         resetPassword,
         getUserInfo, 
         FollowUser,
         CheckFollow
        } from '../controllers/userController.js';
import { verifyToken, verifyTokenNotRes, verifyPasswordChangeLink } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userCreate);

userRouter.post('/login', userLogin);

userRouter.post('/reset-password-submit', resetPasswordSubmit);

userRouter.post('/reset-password', verifyPasswordChangeLink, resetPassword);

userRouter.get('/logout', verifyToken, userLogout);

userRouter.get('/get-user-info', verifyToken, getUserInfo);

userRouter.get('/get-profile', verifyTokenNotRes, getUserInfo);

userRouter.get('/follow', verifyToken, FollowUser);

userRouter.get('/is-followed', verifyToken, CheckFollow);

export default userRouter;