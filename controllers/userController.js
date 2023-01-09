const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

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
    const user = await User.findById(id).populate('favoriteChannels');

    // // wenn wir multiple API calls machen müssen wir das ganze in Promise.all() kapseln
    // const favorites = await Promise.all(
    //   user.favoriteChannels.map((favorite) => Channel.findById(favorite))
    // );

    // TODO: eventuell müssen wir die favorites noch formatieren (muss ich in Postman checken)

    // console.log(favorites);

    res.status(200).json({ favorites: user.favoriteChannels });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

// add a channel to users favorites

const addFavorite = asyncHandler(async (req, res) => {
  const { id, favoriteId } = req.params;

  // first grab the user from id and check if it exists
  const user = await User.findById(id);
  if (!user) {
    res.status(401);
    throw new Error(`User with ID ${id} does not exist!`);
  }

  // second grab the channel and check if it exists
  const channel = await Channel.findById(favoriteId);
  if (!channel) {
    res.status(401);
    throw new Error(`Channel with ID ${id} does not exist!`);
  }

  let savedUser;
  // check, if the favorite Id is included in the Users favorites array
  if (!user.favoriteChannels.includes(favoriteId)) {
    user.favoriteChannels.push(favoriteId);
    // now save it to the database
    savedUser = await (await user.save()).populate('favoriteChannels');

    // sende den aktuellen User (inkl. evtl. neuer Favoriten zurück)
    res.status(200).json({ favoriteChannels: savedUser.favoriteChannels });
  } else {
    res.status(401);
    throw new Error('Channel is already favorite.');
  }
});

// delete a channel from users favorites
const deleteFavorite = asyncHandler(async (req, res) => {
  const { id, favoriteId } = req.params;

  // first grab the user from id and check if it exists
  const user = await User.findById(id);
  if (!user) {
    res.status(401);
    throw new Error(`User with ID ${id} does not exist!`);
  }

  // second grab the channel and check if it exists
  const channel = await Channel.findById(favoriteId);
  if (!channel) {
    res.status(401);
    throw new Error(`Channel with ID ${id} does not exist!`);
  }

  let savedUser;
  // check, if the favorite Id is included in the Users favorites array

  const found = user.favoriteChannels.find(
    (element) => element._id.toString() === favoriteId
  );

  if (found) {
    user.favoriteChannels = user.favoriteChannels.filter(
      (item) => item._id.toString() !== favoriteId
    );
    // now save it to the database
    savedUser = await (await user.save()).populate('favoriteChannels');

    // sende den aktuellen User (inkl. evtl. neuer Favoriten zurück)
    res.status(200).json({ favoriteChannels: savedUser.favoriteChannels });
  } else {
    res.status(401);
    throw new Error('Error deleting channel from favorites.');
  }
});

// UPDATE
// const addRemoveFavorite = asyncHandler(async (req, res) => {
//   const { id, favoriteId } = req.params;
//   try {
//     // grab the user
//     const user = await User.findById(id);

//     // grab the channel
//     const channel = await Channel.findById(favoriteId);

//     // TODO: check if the channel exits in the database
//     if (!channel) {
//       return res
//         .status(400)
//         .json({ msg: 'Channel does not exist in database.' });
//     }

//     // check, if the favorite Id is included in the Users favorites array
//     if (user.favoriteChannels.includes(favoriteId)) {
//       // if included -> remove it from the array
//       user.favoriteChannels = user.favoriteChannels.filter(
//         (id) => id !== favoriteId
//       );
//     } else {
//       // add it to the array
//       user.favoriteChannels.push(favoriteId);
//     }

//     // now save it to the database
//     await user.save();

//     // TODO: eventuell müssen wir wieder formatieren
//     res.status(200).json(user.favoriteChannels);
//   } catch (err) {
//     res.status(404).json({ msg: err.message });
//   }
// });

module.exports = {
  getUser,
  getUserFavorites,
  addFavorite,
  deleteFavorite,
};
