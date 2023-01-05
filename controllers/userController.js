const asyncHandler = require('express-async-handler');

const Channel = require('../models/Channel');
const User = require('../models/User');

// protected route
// so we have the user objekt on the req
const getUser = asyncHandler(async (req, res) => {
  const { user } = req;

  res.status(200).json(user);
});

const getUserFavorites = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    // wenn wir multiple API calls machen müssen wir das ganze in Promise.all() kapseln
    const favorites = await Promise.all(
      user.favoriteChannels.map((favorite) => Channel.findById(favorite))
    );

    // TODO: eventuell müssen wir die favorites noch formatieren (muss ich in Postman checken)

    console.log(favorites);

    res.status(200).json(favorites);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

// UPDATE
const addRemoveFavorite = asyncHandler(async (req, res) => {
  const { id, favoriteId } = req.params;
  try {
    // grab the user
    const user = await User.findById(id);

    // grab the channel
    const channel = await Channel.findById(favoriteId);

    // TODO: check if the channel exits in the database
    if (!channel) {
      return res
        .status(400)
        .json({ msg: 'Channel does not exist in database.' });
    }

    // check, if the favorite Id is included in the Users favorites array
    if (user.favoriteChannels.includes(favoriteId)) {
      // if included -> remove it from the array
      user.favoriteChannels = user.favoriteChannels.filter(
        (id) => id !== favoriteId
      );
    } else {
      // add it to the array
      user.favoriteChannels.push(favoriteId);
    }

    // now save it to the database
    await user.save();

    // TODO: eventuell müssen wir wieder formatieren
    res.status(200).json(user.favoriteChannels);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

module.exports = { getUser, getUserFavorites, addRemoveFavorite };
