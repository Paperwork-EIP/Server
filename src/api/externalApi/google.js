const { Router } = require('express');
const router = new Router();
const axios = require('axios');
const USER = require('../../persistence/users');
const TOKEN = require('../../persistence/tokens');
const jwt = require('jsonwebtoken');
const {URLSearchParams} = require('url');

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    return `${rootUrl}?${new URLSearchParams([
        ['client_id', process.env.google_clientID],
        ['access_type', "offline"],
        ['redirect_uri', process.env.google_redirect_uri],
        ['response_type', "code"],
        ['prompt', "consent"],
        ['scope', [
            'https://www.googleapis.com/auth/calendar',
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
            ].join(" ")]
      ]).toString()}`;
}

router.get("/urlLogin", (request, response) => {
    return response.send(getGoogleAuthURL());
});

async function getLoginTokens(code) {
    const url = "https://oauth2.googleapis.com/token";
    const values = new URLSearchParams([
        ['client_id', process.env.google_clientID],
        ['code', code],
        ['redirect_uri', process.env.google_redirect_uri],
        ['client_secret', process.env.google_secret],
        ['grant_type', "authorization_code"]
    ]).toString();
    const tokens = await axios
        .post(url, values, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        })
    return tokens.data
}

router.get("/login", async (req, response) => {
    try {
        const { code } = req.query;
        if (!code) {
            return response.status(409).json({
                message: "Missing code param.",
            });
        }
        const { id_token, access_token } = await getLoginTokens(code);
        const user = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        const checkUser = await USER.find(user.data.email);
        let jwtToken;
        if (checkUser) {
            await TOKEN.set(checkUser.email, 'google', access_token);
            jwtToken = jwt.sign({ checkUser }, process.env.jwt_key);
            await USER.setToken(checkUser.email, jwtToken);
            return response.status(200).json({
                message: "Connected with google",
                email: checkUser.email,
                jwt: jwtToken,
            });
        } else {
            await USER.create(user.data.id, user.data.email, access_token, "english", true).then(async user => {
                await TOKEN.set(user.email, 'google', access_token);
                jwtToken = jwt.sign({ user }, process.env.jwt_key);
                await USER.setToken(user.email, jwtToken);
                return response.status(200).json({
                    message: "Connected with google",
                    email: user.email,
                    jwt: jwtToken
                });
            });
        }
    } catch (e) {
        console.error(e);
        return response.status(500).json({
            message: "Connection with google failed",
        });
    }
});

router.post("/mobileLogin", async (req, response) => {
    try {
        const { id, email, access_token } = req.body;
        if (!id || !email || !access_token) {
            return response.status(409).json({message: "Missing params.",});
        }
        const checkUser = await USER.find(email);
        let jwtToken;
        if (checkUser) {
            await TOKEN.set(checkUser.email, 'google', access_token);
            jwtToken = jwt.sign({ checkUser }, process.env.jwt_key);
            await USER.setToken(checkUser.email, jwtToken);
            return response.status(200).json({
                message: "Connected with google",
                email: checkUser.email,
                jwt: jwtToken,
            });
        } else {
            let user = await USER.create(id, email, access_token, "english", true).then(async user => {
                await TOKEN.set(email, 'google', access_token);
                jwtToken = jwt.sign({ user }, process.env.jwt_key);
                await USER.setToken(email, jwtToken);
                return response.status(200).json({
                    message: "Connected with google",
                    email: email,
                    jwt: jwtToken
                });
            });
        }
    } catch (e) {
        console.error(e);
        return response.status(500).json({
            message: "Connection with google failed",
        });
    }
});

module.exports = router;