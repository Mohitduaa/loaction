const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/nearby-stores', async (req, res) => {
  const { lat, lng, radius = 2000, type = 'electronics_store' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: GOOGLE_API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('Google API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch nearby stores' });
  }
});

module.exports = router;
