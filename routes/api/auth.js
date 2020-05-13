const express = require('express');
const router = express.Router();

// @route   GET API/auth
// @desc    Test Route
// Route    untuk user nambah apapun 
// @access  Publoc (Don't need token)
router.get('/', (req , res) => res.send('Auth Route'));

module.exports = router;