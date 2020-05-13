const express = require('express');
const router = express.Router();

// @route   GET API/profile
// @desc    Test Route
// Route    untuk user nambah apapun 
// @access  Publoc (Don't need token)
router.get('/', (req , res) => res.send('Profile Route'));

module.exports = router;