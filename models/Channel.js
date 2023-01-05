const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    genre: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Channel', channelSchema);
