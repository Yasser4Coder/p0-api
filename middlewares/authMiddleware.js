require('dotenv').config();
const { verifyAccessToken } = require('../utils/tokenUtils');

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is missing' });
    }

    try {
        const decoded = await verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateUser;