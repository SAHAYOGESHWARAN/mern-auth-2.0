const express = require('express');
const router = express.Router();

// Example route for getting user data
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  // Fetch user by id from the database
  res.send(`User data for user with ID: ${userId}`);
});

// Example route for updating user data
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  // Add logic to update user data in the database
  res.send(`User with ID: ${userId} updated`);
});

module.exports = router;
