const middleware = (permissions) => {
    return (req, res, next) => {
        var target = req.session.user.permissions; // Permissions of user
        var arr = permissions.split('|'); // Permissions required for route
        var result = arr.every(v => target.includes(v)); // Checks if all the required permissions for routes is present in user permissions
        if (result)
            next();
        else {
            var errors = [{
                msg: "You are not authorized.",
                type: 'error'
            }];
            req.flash('errors', errors);
            res.redirect('back');
        }
    }
}
module.exports = middleware;