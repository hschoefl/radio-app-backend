const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath = '',
    favoriteChannels = [],
  } = req.body;

  // check if a user with that email exists
  const existUser = await User.findOne({ email });

  if (existUser) {
    res.status(404);
    throw new Error('User with that e-mail already exists!');
  }

  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    picturePath,
    favoriteChannels,
  });

  await await newUser.save();

  res.status(201).json({
    _id,
    firstName,
    lastName,
    email,
  });
});

// logging in
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // try to find the user in the database
  const user = await User.findOne({ email: email }).populate(
    'favoriteChannels'
  );

  if (!user) {
    res.status(401);
    throw new Error('User does not exist!');
  }

  // check if password is matching
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials!');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  delete user.password; // delete the property password from the user object so that it is not sent back to the front-end

  console.log(user);

  res.status(200).json({
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      favoriteChannels: user.favoriteChannels,
    },
  });
});

module.exports = { register, login };
