const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    // Get token dari header
    const token = req.header('x-auth-token');

    // Check jika tidak ada token
    if(!token){
        return res.status(401).json({msg: 'Tidak Ada Token! Akses Denied'});
    }

    //verifikasi token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token tidak Valid'});
    }
};