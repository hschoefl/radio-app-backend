const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getAllChannels,
  getChannelsFromCloud,
  createChannel,
  updateChannels,
  getChannelsFromCloudIOS,
  getAllChannelsIOS,
} = require('../controllers/channelController');

// router.get('/cloud', verifyToken, getChannelsFromCloud);
router.get('/cloud', verifyToken, getChannelsFromCloud);
router.get('/cloud/ios', getChannelsFromCloudIOS);
router.get('/update', verifyToken, updateChannels);

router.get('/', verifyToken, getAllChannels);
router.get('/ios', getAllChannelsIOS);
router.post('/', verifyToken, createChannel);

module.exports = router;
