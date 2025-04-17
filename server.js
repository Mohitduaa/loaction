const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv"); 
dotenv.config();

app.use(cors());

const GOOGLE_API_KEY = process.env.apikey;

app.get("/api/nearby-stores", async (req, res) => {
  const { address, radius, type } = req.query;

  try {
    const geoRes = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const location = geoRes.data.results[0].geometry.location;

    const nearbyRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: parseInt(radius) || 2000 ,
          type,
          key: GOOGLE_API_KEY,
        },
      }
    );

    res.json(nearbyRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
