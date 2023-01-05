// dient dazu, um nur Routen zu erlauben, die ein gültiges Token haben
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const verifyToken = asyncHandler(async (req, res, next) => {
  // grab the authorization header from the frontend
  let token = req.header('Authorization');

  // check if token even exists
  if (!token) {
    res.status(401);
    throw new Error('Access denied! No token.');
  }

  // check if token starts with "Bearer "
  if (!token.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Invalid token!');
  }

  token = token.split(' ')[1];

  // now verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get the user from the token
    const user = await User.findById(decoded.id).select('-password');

    // throw an error if there is no user in the database
    if (!user) {
      res.status(404);
      throw new Error('There is no user associated with the provided token.');
    }

    // attach the user to the req object
    req.user = user;
  } catch (err) {
    res.status(401);
    throw new Error('Invalid token!');
  }

  next();
});

module.exports = { verifyToken };
