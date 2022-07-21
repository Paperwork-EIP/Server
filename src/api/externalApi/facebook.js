const { Router } = require('express');
const router = new Router();
const axios = require('axios');
const { messenger_clientID, messenger_secret } = require('../../const.json');
var querystring = require('querystring');
const REDIRECT_URI = 'http://172.19.0.2:3000/';

function get_code() {
    const rootUrl = "https://www.facebook.com/v13.0/dialog/oauth";
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: messenger_clientID,
        state: "area5729579483593",
        scope: [
        ].join(" ")
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
}

router.get("/url", (request, response) => {
    return response.send(get_code());
  });

router.get("/", async (req, response) => {
    const code = req.query.code;
    const url = "https://graph.facebook.com/v13.0/oauth/access_token?";
    const data = {
        code,
        client_id: messenger_clientID,
        client_secret: messenger_secret,
        redirect_uri: REDIRECT_URI,
    };
    axios
    .post(url, querystring.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      response.json(res.data.access_token)
    })
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`, error);
      throw new Error(error);
    });
})

module.exports = router;