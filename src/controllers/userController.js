import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function userCreate(req, res) {
    try {
        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        let user = new UserModel({
            username: req.body.username,
            password: hash,
        });
        await user.save();
        res.json({ success: true, message: 'User created' });
    } catch (err) {
        res.json({ success: false, message: 'Failed to create user' });
    }
}

async function userLogin(req, res) {
    let user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
        res.status(401).json({ success: false, message: 'Username or password is not correct!' });
        return;
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
        res.status(401).json({ success: false, message: 'Username or password is not correct!' });
        return;
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