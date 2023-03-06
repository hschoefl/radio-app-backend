const asyncHandler = require("express-async-handler");

const Channel = require("../models/Channel");

// diese Funktion wurde gemacht um Code Duplikation zu vermeiden
const fetchChannels = asyncHandler(async () => {
  const response = await fetch(process.env.A1_RADIO_URL);

  if (!response.ok) {
    res.status(401);
    throw new Error("Can not fetch channels from cloud!");
  }

  const data = await response.json();

  return data;
});

// holt sich eine Liste der aktuellen Radio Channels von der A1 Cloud
const getChannelsFromCloud = asyncHandler(async (req, res) => {
  const data = await fetchChannels();

  res.json({ channels: data });
});

// holt sich eine Liste der aktuellen Radio Channels von der A1 Cloud für IOS Devices
const getChannelsFromCloudIOS = asyncHandler(async (req, res) => {
  console.log("Entering getChannelsFromCloudIOS");
  const data = await fetchChannels();
  console.log(data);

  res.json(data);
});

// dieser Controller aktualisert die Kanäle in der Datenbank mit den Daten aus der Cloud
const updateChannels = asyncHandler(async (req, res) => {
  let numberOfChannelsUpdated = 0;
  let updatedChannels = [];
  const channels = await fetchChannels();

  // nun müssen wir überprüfen, ob für den Channel Namen die audioUrl gleich geblieben ist
  // wenn diese verschieden ist, aktualisieren wir gleich den ganzen Record

  await Promise.all(
    channels.map(async (channel) => {
      const retrievedChannel = await Channel.findOne({ name: channel.name });

      // wenn es den Channel mit diesem Namen noch nicht gibt, dann ist es ein neuer, den fügen wir zur DB dazu
      if (!retrievedChannel) {
        numberOfChannelsUpdated = numberOfChannelsUpdated + 1;
        updatedChannels.push(channel.name);
        const newChannel = new Channel({
          name: channel.name,
          genre: channel.genre,
          description: channel.description,
          logoUrl: channel.logo,
          audioUrl: channel.audioUrl,
        });
        await newChannel.save();
      }
    })
  );

  // console.log("Updated: ", numberOfChannelsUpdated);
  res.status(201).json({ numberOfChannelsUpdated, updatedChannels });
});

// alle Radio Channels aus der Datenbank holen
const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find({});

    // sort channels alphabetically
    channels.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    res.json({ channels });
  } catch (error) {
    res.status(400).json({ message: "Can not fetch channels from DB." });
  }
};

// alle Radio Channels aus der Datenbank holen
const getAllChannelsIOS = async (req, res) => {
  try {
    const channels = await Channel.find({});

    // sort channels alphabetically
    channels.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    res.json(channels);
  } catch (error) {
    res.status(400).json({ message: "Can not fetch channels from DB." });
  }
};

const createChannel = async (req, res) => {
  console.log(req.body);

  const { name, genre, description, logoUrl, audioUrl } = req.body;

  if (!name || genre.length === 0 || !description || !logoUrl || !audioUrl) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  try {
    const newChannel = new Channel({
      name,
      genre,
      description,
      logoUrl,
      audioUrl,
    });

    const returnedChannel = await newChannel.save();

    if (!returnedChannel) {
      res
        .status(400)
        .json({ message: "Can not create new radio channel in database." });
    }

    res.json(returnedChannel);
  } catch (error) {
    res.status(400).json({ message: "Can not create radio channel." });
  }
};

module.exports = {
  getAllChannels,
  getChannelsFromCloud,
  createChannel,
  updateChannels,
  getChannelsFromCloudIOS,
  getAllChannelsIOS,
};
