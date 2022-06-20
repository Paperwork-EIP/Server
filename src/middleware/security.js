const jwt = require('jsonwebtoken');
const { jwt_key } = require('../const');

exports.checkJWT = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, jwt_key, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.body.user = decoded.user;
                next();
            }
        });
    } else {
        return res.status(401).json('token_required');
    }
}