require('dotenv').config();

const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    greet: 'Hello World! 🎉🎉🎉🎉',
  });
});

app.post('/login', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      throw new Error('No Code was provided from user!!');
    }
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://localhost:3000',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const spotifyData = await spotifyApi.authorizationCodeGrant(code);

    res.json({
      accessToken: spotifyData.body.access_token,
      refresh_token: spotifyData.body.refresh_token,
      expires_in: spotifyData.body.expires_in,
    });
  } catch (e) {
    console.error(e.message);
    res.json({
      message: e.message,
      error: true,
    });
  }
});

app.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error('No refreshToken was provided from user!!');
    }
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://localhost:3000',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      refreshToken,
    });

    const spotifyData = await spotifyApi.refreshAccessToken();

    res.json({
      accessToken: spotifyData.body.accessToken,
      expiresIn: spotifyData.body.expiresIn,
    });
  } catch (e) {
    console.error(e.message);
    res.json({
      message: e.message,
      error: true,
    });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, console.log('🚀 Spotify clone server has started'));
