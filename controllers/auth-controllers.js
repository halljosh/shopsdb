const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => { 
    let errorMessage = req.flash('loginerror');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth-views/login', {docTitle: 'login', path: '/login', isLoggedIn: false, errorMessage: errorMessage });
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password
    User.findOne({username: username})
            .then(user => {
                if(!user) {
                    req.flash('loginerror', 'invalid username or password');
                    return res.redirect('/login');
                }
                bcrypt
                    .compare(password, user.password)
                    .then(matched => {
                        if (matched) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                console.log(err);
                                console.log('logged in!');
                                res.redirect('/');
                            });
                        }
                        req.flash('loginerror', 'invalid username or password');
                        res.redirect('/login');
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/login');
                });
            })
            .catch(err => console.log(err));  
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('signuperror');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth-views/signup', {docTitle: 'signup', path: '/signup', isLoggedIn: false, errorMessage: errorMessage });
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User
        .findOne({username: username})
        .then(userRecord => {
            if (userRecord) {
                req.flash('signuperror', 'username already exists! try another one?');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPass => {
                    const user = new User ({
                        username: username,
                        password: hashedPass,
                        cart: { items: [] }
                    });
                return user.save();
            })
            .then(result => {
                console.log('user successfully signed up!');
                res.redirect('/login');
            });
        })
        .catch(err => {
            console.log(err);
        });
};
