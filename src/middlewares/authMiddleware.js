import jwt from 'jsonwebtoken';

function authenciateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No authorization!' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'No authorization!' });
        }
        req.userId = decoded.id;
        next();
    });
}