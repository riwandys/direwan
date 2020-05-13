const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/user')
// @route   POST API/user
// @desc    Register User
// Route    untuk user nambah apapun 
// @access  Publoc (Don't need token)
router.post('/', [
    check('name', 'Silahkan Isi Kolom Nama').not().isEmpty(),
    check('nim' , 'Silahkan Isi Nim Dengan Benar').isNumeric().isLength({min:8, max:8}),
    check('email', 'Silahkan isi Email dengan Benar').isEmail(),
    check('password', 'Isi Password dengan 6 karakter atau lebih').isLength({min:6})
],
async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const {name, nim, email, password} = req.body;

    try {
        let user = await User.findOne({
            $or : [
                {email},
                {nim}
            ]
        });
        // Jika user telah terdaftar
        if(user){
           return res.status(400).json({errors: [{msg: 'User Telah Terdafar!'}]});
        }

        //Get user gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            nim,
            email,
            avatar,
            password
        });

        //Enkrispsi Passowrd
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
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