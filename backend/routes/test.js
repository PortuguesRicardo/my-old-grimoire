const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');

router.get('/protected', auth, (req, res) => {
  res.status(200).json({ message: `Access granted to user ${req.auth.userId}` });
});

module.exports = router;
