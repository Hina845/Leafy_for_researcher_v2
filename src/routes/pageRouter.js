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

pageRouter.get('/profile', (req, res) => {
    res.sendFile(path.join(root, '4-profile.html'));
});

pageRouter.get('/archive', (req, res) => {
    res.sendFile(path.join(root, '5-archive.html'));
})

pageRouter.get('/test', (req, res) => {
    res.sendFile(path.join(root, 'components', 'navigation.html'));
});


export default pageRouter;