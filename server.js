const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "c4aad8dbd21b4ded93d801cee8c6ce40",
    clientSecret: "3e402e8c39e74bc0aff470e9db11e9c7",
    refreshToken
  });

  spotifyApi.refreshAccessToken().then(
    (data) => {
      console.log(data.body);

      spotifyApi.setAccessToken(data.body['access_token']);
    }).catch(() => {
      res.sendStatus(400);
    })
})

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "c4aad8dbd21b4ded93d801cee8c6ce40",
    clientSecret: "3e402e8c39e74bc0aff470e9db11e9c7",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(3001)
