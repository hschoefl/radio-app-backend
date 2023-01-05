const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getUser,
  getUserFavorites,
  addRemoveFavorite,
} = require('../controllers/userController');

// READ
// router.get('/:id', verifyToken, getUser);
router.get('/me', verifyToken, getUser);
router.get('/:id/favorites', verifyToken, getUserFavorites);

// UPDATE
router.patch('/:id/:favoriteId', verifyToken, addRemoveFavorite);

module.exports = router;
