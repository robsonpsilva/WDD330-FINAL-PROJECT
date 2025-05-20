const express = require('express');
const axios = require('axios');
const router = express.Router();

const HIKING_API_KEY = process.env.HIKING_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

router.get('/trails', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get(`https://www.hikingproject.com/data/get-trails`, {
      params: {
        lat,
        lon,
        maxResults: 5,
        key: HIKING_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar trilhas' });
  }
});

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: WEATHER_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
});

module.exports = router;
