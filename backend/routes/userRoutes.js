
const express = require('express');
const router = express.Router();

// Define routes correctly
router.get('/some-route', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
