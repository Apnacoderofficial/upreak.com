module.exports = (req, res, next) => {
    if (req.session && req.session.userid && req.url != '/login')
        next();
    else if (req.session && req.session.userid && req.url == '/login') {
        req.flash('errors', 'You are already logged in.');
        res.redirect('/panel/dash_index');
    } else if (req.url == '/')
        next();
    else if (req.originalUrl.indexOf('/panel/') > -1 && req.url != '/login') {
        req.flash('errors', 'Please login to continue.');
        res.redirect('/panel/login');
    } else {
        next();
    }
}