const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h', algorithm: 'HS256' },
            (err, token) => (err ? reject(err) : resolve(token))
        );
    });
};

const verifyAccessToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
};
