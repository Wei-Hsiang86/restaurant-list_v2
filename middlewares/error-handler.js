module.exports = (error, req, res, next) => {
    console.log(error);
    req.flash("error", error.errorMessage || "伺服器錯誤");
    res.redirect("back");

    next(error)
}
