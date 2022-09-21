const { Router } = require('express');
const router = new Router();
const { google_clientID, google_secret } = require('../../const.json');
const axios = require('axios');
const querystring = require('querystring');
const USER = require('../../persistence/users')
const TOKEN = require('../../persistence/tokens')
const jwt = require('jsonwebtoken');
const { jwt_key } = require('../../const.json');
const REDIRECT_URI = 'http://localhost:3000/GoogleLogin';

function getGoogleAuthURL(redirect) {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: redirect,
        client_id: `${google_clientID}`,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
        ].join(" ")
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
}

router.get("/url", (request, response) => {
    return response.send(getGoogleAuthURL(REDIRECT_URI));
});

router.get("/urlLogin", (request, response) => {
    return response.send(getGoogleAuthURL(REDIRECT_URI));
});

async function getTokens(code) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: google_clientID,
        client_secret: google_secret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
    };
    tokens = await axios
        .post(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        })
    return tokens.data
    }

    router.get("/", async (req, response) => {
    try {
        const { access_token } = await getTokens(req.query.code)
        return response.json(access_token)
    } catch (e) {
        console.error(e)
    }
})

async function getLoginTokens(code) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: google_clientID,
        client_secret: google_secret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
    };
    tokens = await axios
        .get(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        })
    return tokens.data
}

router.get("/login", async (req, response) => {
    try {
        const { id_token, access_token } = await getLoginTokens(req.query.code)
        const user = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
            }
            )
        const checkUser = await USER.find(user.data.email)
        if (checkUser) {
        TOKEN.set(checkUser.email, 'google', access_token);
        return response.status(200).json({
            message: "Connected with google",
            jwt: jwt.sign({user: {id: checkUser.id, email: checkUser.email }}, jwt_key)
        })
        } else {
        USER.create(user.data.id, user.data.email, user.data.access_token).then(user => {
            TOKEN.set(user.email, 'google', access_token);
            const jwtToken = jwt.sign({ user }, jwt_key);
            return response.status(200).json({
            message: "Connected with google",
            jwt: jwtToken
            })
        })
        }
    } catch (e) {
        console.error(e)
    }
})

module.exports = router;