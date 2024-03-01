const jwt = require('jsonwebtoken');

const authtoken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, 'secret@26');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}
module.exports = authtoken;