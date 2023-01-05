const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getAllChannels,
  getChannelsFromCloud,
  createChannel,
  updateChannels,
} = require('../controllers/channelController');

router.get('/cloud', verifyToken, getChannelsFromCloud);
router.get('/update', verifyToken, updateChannels);

router.get('/', verifyToken, getAllChannels);
router.post('/', verifyToken, createChannel);

module.exports = router;
