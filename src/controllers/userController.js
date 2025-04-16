import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export {
    userCreate,
    userLogin,
    userLogout
}