import express from 'express';
import path from 'path';
import {verifyPasswordChangeLink} from '../middlewares/authMiddleware.js';

const root = path.resolve('public');

const pageRouter = express.Router();

pageRouter.get('/login', (req, res) => {
    res.sendFile(path.join(root, '1-log-in.html'));
});

pageRouter.get('/signup', (req, res) => {
    res.sendFile(path.join(root, '3-sign-up.html'));
});

pageRouter.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(root, '2-forgot-password.html'));
});

pageRouter.get('/change-password', verifyPasswordChangeLink, (req, res) => {
    res.sendFile(path.join(root, '2-3-change-password.html'));
});

export default pageRouter;