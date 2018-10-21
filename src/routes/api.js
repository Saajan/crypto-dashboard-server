import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
const SECRET = process.env.SECRET;
var router = express.Router();
import getModels from '../models';

import {
  getToken,
  eachApiCall
} from '../utils/helpers';
var User = require("../models/User");

router.post('/signup', async (req, res) => {
  let {
    username,
    password,
    email
  } = req.body;
  if (!username || !password || !email) {
    res.json({
      success: false,
      msg: 'Please enter username, password and email.'
    });
  } else {
    //console.log(req.body, models);
    const responsePromise = getModels().then(async (models) => {
      const userAlreadyExists = await models.user.findOne({
        where: {
          username,
        },
        raw: true
      });

      if (userAlreadyExists) {
        return {
          success: false,
          msg: "User already exist."
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await models.user.create({
        username,
        password: hashedPassword,
        email
      }, {
        raw: true
      });

      if (user) {
        return {
          success: true,
          msg: "User registration successful."
        };
      }
    });

    responsePromise.then(data => {
      res.json(data);
    });
  }
});

router.post('/signin', function (req, res) {
  let {
    username,
    password
  } = req.body;

  if (!username || !password) {
    res.json({
      success: false,
      msg: 'Please enter username and password.'
    });
  }

  const responsePromise = getModels().then(async (models) => {
    const user = await models.user.findOne({
      where: {
        username,
      },
      raw: true,
    });

    if (!user) {
      // user with provided username not found
      return {
        success: false,
        msg: 'User name does not exist.',
      };
    }

    console.log(user);

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      // bad password
      return {
        success: false,
        msg: 'Wrong password',
      };
    }

    console.log(valid);

    const token = jwt.sign({
      id: user.id
    }, SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });

    const account = await models.account.findOne({
      where: {
        userid: user.id,
      },
      raw: true,
    });

    if (valid) {
      return {
        success: true,
        status: account.status,
        user: {
          username: user.username
        },
        token
      }
    }
  });

  responsePromise.then(data => {
    res.json(data);
  });
});


router.get('/getCurrentPrice', async (req, res) => {

  let currencyList = ['BTC-USD', 'LTC-USD', 'ETC-USD', 'ETH-USD', 'BCH-USD'];

  const promises = await currencyList.map((p) => {
    return eachApiCall(p);
  });

  Promise.all(promises).then(function (response) {
    res.json(response);
  });
  //https: //api.coinbase.com/v2/prices/BTC-USD/buy
})

module.exports = router;