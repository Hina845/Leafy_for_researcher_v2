import UserModel from '../models/userModel.js';
import AuthTokenModel from '../models/authtokenModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';
import { server } from '../config.js';

const __dirname = path.resolve('src');

async function userCreate(req, res) {
    try {
        const email_match = await UserModel.findOne({ email: req.body.email });
        if (email_match) {
            return res.status(400).json({ success: false, error: 'email-exist' });
            
        }

        const username_match = await UserModel.findOne({ username: req.body.username });
        if (username_match) {
            return res.status(400).json({ success: false, error: 'username-exist' });
            
        }

        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        let user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });
        await user.save();
        return res.json({ success: true, message: 'User created' });
    } catch (err) {
        console.error(err.message);
        return res.json({ success: false, error: err.message });
    }
}

async function userLogin(req, res) {
    let user = await UserModel.findOne({ username: req.body.username });
    if (!user) user = await UserModel.findOne({ email: req.body.username });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Username or password is not correct!' });
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Username or password is not correct!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });
    res.json({ success: true, message: 'Login successful'});
}

async function userLogout(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logout successful' });
}

async function resetPasswordSubmit(req, res) {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ success: false, error: 'email-not-found' });

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await AuthTokenModel.findOneAndUpdate({ email: req.body.email }, {$set: { token: token }, email: req.body.email}, { new: true, upsert: true });

    const link = `${server}/change-password?token=${token}`;

    const html = await ejs.renderFile(`${__dirname}/views/reset_password_mail.ejs`, { resetLink: link })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        });
    if (!html) res.status(500).json({ success: false, error: 'Internal server error' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Noreply: Password change request',
        html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, error: 'Internal server error' });
        else return res.json({ success: true, message: 'Email sent' });
    });
}

async function resetPassword(req, res) {
    const email = req.email;

    const new_password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    await UserModel.findOneAndUpdate({ email: email }, { $set: { password: new_password } });

    return res.json({ success: true, message: 'Password changed successfully' });
}

export {
    userCreate,
    userLogin,
    userLogout,
    resetPasswordSubmit,
    resetPassword,
}