const { Router } = require('express');
const User = require('../../persistence/users');
const jwt = require('jsonwebtoken');
const { jwt_key } = require('../../const');
const router = new Router();

router.post('/register', async (request, response) => {
    try {
      const { pseudo, email, password } = request.body;
      console.log('test');
      if (!email || !password || !pseudo) {
        return response
          .status(400)
          .json({ message: 'Email or password missing' });
      }
      const check_user = await User.find(email);
      const check_pseudo = await User.find(pseudo);
      if (check_user) {
        return response.status(409).json({ message: 'Email already used' });
      }
      if (check_pseudo) {
        return response.status(409).json({ message: 'Pseudo already used' });
      }
      const user = await User.create(pseudo, email, password);
      return response.status(200).json({
        message: 'User registered !',
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
          return response.status(400).json({ message: 'Invalid email or password' });
        } else {
          return response.status(200).json({
            message: 'User logged in !',
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
  
module.exports = router;