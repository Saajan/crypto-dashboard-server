import bcrypt from 'bcrypt';
const SECRET = process.env.SECRET;
import express from 'express';
var router = express.Router();
import getModels from '../models';
import {
  getToken
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

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      // bad password
      return {
        success: false,
        msg: 'Wrong password',
      };
    }

    const token = user.password + SECRET;

    const account = await models.accounts.findOne({
      where: {
        userid: user.id,
      },
      raw: true,
    });

    if (valid) {
      return {
        success: true,
        account,
        user,
        token
      }
    }
  });

  responsePromise.then(data => {
    res.json(data);
  });
});


router.get('/crypto', function () {
  //https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2013-09-05
})

module.exports = router;