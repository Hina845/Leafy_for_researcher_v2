import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        req.userId = decoded.id;
        next();
    });
}

function verifyPasswordChangeLink(req, res, next) {
    const token = req.query.token;
    if (!token) {
        return res.redirect('/')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/')
        }
        req.email = decoded.email;
        next();
    });
}

export {
    verifyToken,
    verifyPasswordChangeLink,
};