const { Router } = require('express');
const User = require('../../persistence/users');
const Settings = require('../../persistence/userSettings');
const jwt = require('jsonwebtoken');
const { jwt_key } = require('../../const');
const router = new Router();

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
      return response.status(200).json({
        message: 'User registered !',
        email: user.email,
        jwt: jwt.sign({ user }, jwt_key)
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
          return response.status(200).json({
            message: 'User logged in !',
            email: check_connect.user.email,
            jwt: jwt.sign({ user: check_connect.user }, jwt_key)
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
      const { email } = request.query
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
      const { username } = request.query
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

  router.get('/getSettings', async (request, response) => {
    try{
      const { email } = request.query
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email)
      if (find) {
        const settings = await Settings.get(find.id)
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
      const { email } = request.query
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email)
      if (find) {
        await User.delete(email)
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

  router.get('/modifyDatas', async (request, response) => {
    try{
      const { email, new_email, language,
              username, firstname, name, age,
              adress, number_phone, profile_picture, password
            } = request.query
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email)
      if (find) {
        data =
        {"language":language, "password": password,
          "username":username, "firstname":firstname, "name":name, "age":age,
          "adress":adress, "profile_picture":profile_picture, "number_phone":number_phone,
          "email":new_email, 
        }
        if (await User.find(new_email) && new_email != email) {
          return response.status(409).json({ message: 'Email already used' });
        }
        if (await User.findUsername(username) && username != find.username) {
          return response.status(409).json({ message: 'Usename already used' });
        }
        for (let key in data) {
          await User.modifyDatas(email, key, data[key])
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
      const { email, night_mode } = request.query
      if (!email) {
        return response.status(400).json({ message: 'Missing parameter email.' });
      }
      const find = await User.find(email)
      if (find) {
        id = find.id
        data = {"night_mode":night_mode,}
        for (const key in data) {
          const value = await Settings.modifySettings(id, key, data[key])
        }
        return response.status(200).json({ message: 'User setting updated' });
      } else {
        return response.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;