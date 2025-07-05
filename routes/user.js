const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const usersController = require("../controllers/users.js");

// Sign Up
//get   ||  //post
router.route("/signup")
.get(usersController.renderSignupForm)
.post(wrapAsync(usersController.signupUser));

//Login 
//get    ||  //post
router.route("/login")
.get(usersController.renderLoginForm)
.post(saveRedirectUrl,
   passport.authenticate('local', { failureRedirect: '/login', failureFlash:true })
    ,usersController.loginUser);

//logout
router.get("/logout",usersController.logoutUser);


module.exports = router;