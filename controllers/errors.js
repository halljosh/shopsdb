exports.get404 = (req, res, next) => {  //generic 404 error message
    res.status(404).render('404', {docTitle: '404', path: '/404', isLoggedIn: req.isLoggedIn});
};