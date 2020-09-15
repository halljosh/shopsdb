const { check, body } = require('express-validator/');
const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth-controllers');

router.get('/login', authController.getLogin);

router.post('/login', check('username').trim(), body('password').trim(), authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
    check('username')
        .isAlphanumeric()
        .trim()
        .withMessage('usernames must contain only alphanumeric characters'), 
    
    body('password')
        .isLength({min: 6})
        .trim()
        .withMessage('paswords must be at least 6 characters long'), 
        
    body('confirmedpassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('passwords must match!');
            }
            return true;
}), authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', check('username').trim(), body('password').trim(), body('confirmedpassword').trim(), authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;