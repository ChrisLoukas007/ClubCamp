const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

//register -> Form
//POST / register -> create a user
//login -> Form
//POST /login -> you do a login in

router
	.route("/register")
	.get(users.renderRegister)
	.post(catchAsync(users.register));

//SOS -> passport.authenticate is a middleware and it's used in order to specidy which type passport we want eg. we want like Google or like Twitter
router
	.route("/login")
	.get(users.renderLogin)
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		users.login
	);

router.get("/logout", users.logout);

module.exports = router;
