module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.flash("error", "you must must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}