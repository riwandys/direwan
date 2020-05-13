const express = require('express');
const router = express.Router();

// @route   GET API/posts
// @desc    Test Route
// Route    untuk user nambah apapun 
// @access  Publoc (Don't need token)
router.get('/', (req , res) => res.send('Posts Route'));

module.exports = router;