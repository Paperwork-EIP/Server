const { Router } = require('express');
const Token = require('../../persistence/tokens');
const router = new Router();

router.post('/set', async (req, res) => {
  try {
    const { service, token, user } = req.body
    Token.set(user.email, service, token, (status) => {
      if (status) {
        res.status(200).json({message: `${service} token updated`})
      } else {
        res.status(500).json({message: 'An error has occured'})
      }
    })
  } catch (error) {
    console.error(error);
  }
})

router.get('/get', async (req, res) => {
  try {
    const service = req.query.service
    const { user } = req.body
    const token = await Token.find(user.email, service)
    res.send(token)
  } catch (e) {
    throw e
  }
})

router.get('/getAll', async (req, res) => {
  try {
    const { user } = req.body
    const tokens = await Token.findAll(user.email)
    res.status(200).json(tokens)
  } catch (e) {
    throw e
  }
})

router.delete('/delete/:service', async (req, res) => {
  try {
    const { user } = req.body
    const service = req.params.service
    Token.set(user.email, service, null, (status) => {
      if (status) {
        res.status(200).json({message: `${service} token deleted`})
      } else {
        res.status(500).json({message: 'An error has occured'})
      }
    })
  } catch (error) {
    console.error(error);
  }
})

module.exports = router;