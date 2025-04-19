import UserModel from '../models/userModel.js';
import AuthTokenModel from '../models/authtokenModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import fs from 'fs';
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
            display_name: req.body.username,
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
    res.redirect('/login');
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

async function getUserInfo(req, res) {
    const user = await UserModel.findById(req.userId)
    let profile_picture_url = 'assets/images/imgDefaultProfilePicture.png';

    const profilePicturePath = path.join(__dirname, '..', 'public', 'users', user._id.toString())

    if (fs.existsSync(profilePicturePath)) {
        const files = fs.readdirSync(profilePicturePath);
        profile_picture_url = path.join('users', user._id.toString(), files[0]);
    }

    let data = {
        _id: user._id,
        username: user.username,
        display_name: user.display_name,
        profile_picture_url: profile_picture_url,
        owned_posts: user.owned_posts,
        viewed_posts: user.viewed_posts,
        followers: user.followers.length,
        total_views: user.total_views,
    }

    if (req.is_owner) data.is_owner = req.is_owner;
    if (req.is_login) data.is_login = true;
    else data.is_login = false;

    res.json({
        success: true,
        data: data
    });
}

async function FollowUser(req, res) {
    const user = await UserModel.findById(req.userId);
    const follow_user = await UserModel.findById(req.query.user_id);

    if (!user || !follow_user) return res.status(404).json({ success: false, error: 'User not found' });

    if (user.followed.includes(follow_user._id)) {
        user.followed = user.followed.filter(id => id.toString() !== follow_user._id.toString());
        follow_user.followers = follow_user.followers.filter(id => id.toString() !== user._id.toString());
    } else {
        user.followed.push(follow_user._id);
        follow_user.followers.push(user._id);
    }

    await user.save();
    await follow_user.save();

    return res.json({ success: true, message: 'Followed/Unfollowed successfully' });
}

async function CheckFollow(req, res) {
    const user = await UserModel.findById(req.userId);
    let follow_user;
    if (req.query.user_id != req.userId) follow_user = req.query.user_id;

    if (!user || !follow_user) return res.status(404).json({ success: false, error: 'User not found' });

    if (user.followed.includes(follow_user._id)) {
        return res.json({ success: true, message: 'Followed', is_followed: true });
    }
    return res.json({ success: true, message: 'Not followed', is_followed: false });
}

export {
    userCreate,
    userLogin,
    userLogout,
    resetPasswordSubmit,
    resetPassword,
    getUserInfo,
    FollowUser,
    CheckFollow,
}