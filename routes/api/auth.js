const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
// @route   GET API/auth
// @desc    Test Route
// Route    untuk user nambah apapun 
// @access  Public (Don't need token)
router.get('/', auth, async (req , res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST API/auth
// @desc    Authenticate User Get Token

// @access  Public (Don't need token)
router.post('/', [
    check('email', 'Silahkan isi Email dengan Benar').isEmail(),
    check('password', 'Password is Require').exists()
],
async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        // Jika user telah terdaftar
        if(!user){
           return res.status(400).json({errors: [{msg: 'User Tidak Terdaftar!'}]});
        }

        const isMAtch = await bcrypt.compare(password, user.password);

        if(!isMAtch) {
            return res.status(400).json({errors: [{msg: 'Silahkan Cek Kembali email dan password Anda!'}]});
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if(err) throw err;
            res.json({token});
        }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
   
});

module.exports = router;