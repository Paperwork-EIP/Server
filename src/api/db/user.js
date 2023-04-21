const { Router } = require('express');
const User = require('../../persistence/users');
const Settings = require('../../persistence/userSettings');
const jwt = require('jsonwebtoken');
const router = new Router();
const AWS = require('aws-sdk');
const SERVER_URL = "https://prod.d1pxqc46foir5s.amplifyapp.com"
AWS.config.update({region:'us-east-1'});
const ses = new AWS.SES();

router.post('/register', async (request, response) => {
    try {
      const { username, email, password} = request.body;
      if (!email || !password || !username) {
        return response
          .status(400)
          .json({ message: 'Pseudo, email or password missing' });
      }
      const check_user = await User.find(email);
      const check_username = await User.findUsername(username);
      if (check_user) {
        return response.status(409).json({ message: 'Email already used' });
      }
      if (check_username) {
        return response.status(409).json({ message: 'Usename already used' });
      }
      const user = await User.create(username, email, password);
      await Settings.create(user.id);
      const token = jwt.sign({ user }, process.env.jwt_key);
      await User.setToken(email, token);
      return response.status(200).json({
        message: 'User registered !',
        email: user.email,
        jwt: token
      });
    } catch (error) {
      console.error(
        `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
      );
      response.status(500).json();
    }
  });

  router.post('/login', async (request, response) => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        return response
          .status(400)
          .json({ message: 'Email or password missing' });
      }
      User.connect(email, password, (check_connect) => {
        if (check_connect.code === 'no email') {
          return response.status(404).json({ message: 'User does not exists' });
        } else if (check_connect.code === "invalid") {
          return response.status(400).json({ message: 'Invalid password' });
        } else {
          const token = jwt.sign({ user: check_connect.user }, process.env.jwt_key);
          User.setToken(email, token);
          return response.status(200).json({
            message: 'User logged in !',
            email: check_connect.user.email,
            jwt: token
          });
        }
      })
    } catch (error) {
      console.error(
        `login({ email: ${request.body.email}, password: ${request.body.password} }) >> Error: ${error.stack}`
      );
      response.status(500).json();
    }
  });

  router.get('/getbyemail', async (request, response) => {
    try{
      const { email } = request.query;
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email)
      if (find) {
        return response.status(200).json(find);
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.get('/getbyusername', async (request, response) => {
    try{
      const { username } = request.query;
      if (!username) {
        return response.status(400).json({ message: 'Missing parameter username.' });
      }
      const find = await User.findUsername(username)
      if (find) {
        return response.status(200).json(find);
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.get('/getbytoken', async (request, response) => {
    try{
      const { token } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token);
      if (find) {
        return response.status(200).json(find);
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.get('/getSettings', async (request, response) => {
    try{
      const { token } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token);
      if (find) {
        const settings = await Settings.get(find.id);
        return response.status(200).json(settings);
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.get('/delete', async (request, response) => {
    try{
      const { token } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token)
      if (find) {
        await User.delete(find.email)
        await Settings.delete(find.id)
        return response.status(200).json({ message: 'User deleted' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.post('/modifyDatas', async (request, response) => {
    try{
      const { token, new_email, language,
              username, firstname, name, age,
              adress, number_phone, profile_picture, password
            } = request.body;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token)
      if (find) {
        const data =
        {"language":language, "password": password,
          "username":username, "firstname":firstname, "name":name, "age":age,
          "adress":adress, "profile_picture":profile_picture, "number_phone":number_phone,
          "email":new_email, 
        }
        if (await User.find(new_email) && new_email != find.email) {
          return response.status(409).json({ message: 'Email already used' });
        }
        if (await User.findUsername(username) && username != find.username) {
          return response.status(409).json({ message: 'Usename already used' });
        }
        for (let key in data) {
          await User.modifyDatas(find.email, key, data[key]);
        }
        return response.status(200).json({ message: 'User updated' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });

  router.get('/modifySettings', async (request, response) => {
    try{
      const { token, night_mode } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token);
      if (find) {
        const id = find.id;
        const data = {"night_mode":night_mode,};
        for (const key in data) {
          await Settings.modifySettings(id, key, data[key]);
        }
        return response.status(200).json({ message: 'User setting updated' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/sendVerificationEmail', async (request, response) => {
    try{
      const { token } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token);
      if (find) {
        if (find.email_verified) {
          return response.status(409).json({ message: 'Email already verified' });
        }
        const params = {
          Destination: {
            ToAddresses: [find.email]
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `<!DOCTYPE html><html lang="en\"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verification Email</title></head><body><h1>Verify your email</h1><p>Click on the following link to verify your email:</p><a href="${SERVER_URL}/verifyEmail?token=${token}">${SERVER_URL}/verifyEmail?token=${token}</a></body></html>`
              }
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Verify Your Email Address"
            }
          },
          Source: process.env.EMAIL
        };
        await ses.sendEmail(params).promise();
        return response.status(200).json({ message: 'Email send.' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    }
    catch (error) {
      return response.status(500).json({ message: 'System error.', error });
    }
  });
  router.get('/verifyEmail', async (request, response) => {
    try{
      const { token } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      const find = await User.findToken(token);
      if (find) {
        if (find.email_verified) {
          return response.status(409).json({ message: 'Email already verified' });
        }
        await User.setEmailVerified(token, true);
        return response.status(200).json({ message: 'User email verified' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    }
    catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/sendResetPasswordEmail', async (request, response) => {
    try{
      const { email } = request.query;
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email);
      const token = jwt.sign({ find }, process.env.jwt_key);
      await User.setToken(email, token);
      if (find) {
        const params = {
          Destination: {
            ToAddresses: [find.email]
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `<!DOCTYPE html><html lang="en\"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset Password Email</title></head><body><h1>Reset your password</h1><p>Click on the following link to reset your password:</p><a href="${SERVER_URL}/resetPassword?token=${token}">${SERVER_URL}/resetPassword?token=${token}</a></body></html>`
              }
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Reset Your Password"
            }
          },
          Source: EMAIL
        };
        await ses.sendEmail(params).promise();
        return response.status(200).json({ message: 'Email send.' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    }
    catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/resetPassword', async (request, response) => {
    try{
      const { token, password } = request.query;
      if (!token) {
        return response.status(400).json({ message: 'Missing parameter token.' });
      }
      if (!password) {
        return response.status(400).json({ message: 'Missing parameter password.' });
      }
      const find = await User.findToken(token);
      if (find) {
        await User.setPassword(token, password);
        return response.status(200).json({ message: 'User password reset' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    }
    catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });
module.exports = router;