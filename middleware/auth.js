const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    //Purpose: to get the token (from request's header) & verify it
    const token = req.header('x-auth-token')

    if(!token) {
        return res.status(401).json({ msg: 'Authorization denied!' });
    }

    try {
        //Verify
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        //Add user from payload
        req.user = decoded;
        next();
    }
    catch(e) {
        res.status(400).json({ msg: 'Invalid token!' });
    }
}

module.exports = auth;