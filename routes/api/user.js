const express = require('express');
const router = express.Router();

// @route   GET API/user
// @desc    Test Route
// Route    untuk user nambah apapun 
// @access  Publoc (Don't need token)
router.get('/', (req , res) => res.send('User Route'));

module.exports = router;