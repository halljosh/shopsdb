const { check } = require('express-validator/check');
const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth-controllers');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', check('username').isAlphanumeric().withMessage('usernames must contain only alphanumeric characters'), authController.postSignup)

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;