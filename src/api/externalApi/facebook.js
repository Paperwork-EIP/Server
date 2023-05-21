const { Router } = require('express');
const router = new Router();
const axios = require('axios');
const REDIRECT_URI = 'http://localhost:3000/facebookLogin';
const USER = require('../../persistence/users');
const TOKEN = require('../../persistence/tokens');
const jwt = require('jsonwebtoken');
const {URLSearchParams} = require('url');

function get_code() {
    const rootUrl = "https://graph.facebook.com/oauth/authorize";
  return `${rootUrl}?${new URLSearchParams([
    ['state', "paperwork"],
    ['client_id', process.env.messenger_clientID],
    ['scope', [
      'email',
      'public_profile'
    ].join(" ")],
    ['redirect_uri', REDIRECT_URI]
  ]).toString()}`;
}

router.get("/url", (request, response) => {
    return response.send(get_code());
  });

async function getAccessToken(code) {
  const url = "https://graph.facebook.com/v13.0/oauth/access_token";
  const tokens = await axios
      .post(url, new URLSearchParams([
        ['code', code],
        ['client_id', process.env.messenger_clientID],
        ['client_secret', process.env.messenger_secret],
        ['redirect_uri', REDIRECT_URI],
        ['grant_type', "authorization_code"]
      ]).toString(), {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      })
  return tokens.data
}

router.get("/", async (req, response) => {
  try {
    const { code } = req.query;
    if (!code) {
        return response.status(409).json({
            message: "Missing code param.",
        })
    }
    const { access_token } = await getAccessToken(code)
    const user = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=email,first_name,last_name`,
      {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
      }
    )
    const checkUser = await USER.find(user.data.email)
    if (checkUser) {
      await TOKEN.set(checkUser.email, 'facebook', access_token);
      return response.status(200).json({
        message: "Connected with facebook",
        email: checkUser.email,
        jwt: jwt.sign({user: {id: checkUser.id, email: checkUser.email }}, process.env.jwt_key)
      })
    } else {
      await USER.create(user.data.id, user.data.email, user.data.access_token).then(async user =>{
        await TOKEN.set(user.email, 'facebook', access_token);
        const jwtToken = jwt.sign({ user }, process.env.jwt_key);
        return response.status(200).json({
        message: "Connected with facebook",
        jwt: jwtToken
        })
      })
    }
  } catch (e) {
    console.error(e)
    return response.status(500).json({
      message: "Connection with facebook failed",
  })
  }
})

module.exports = router;