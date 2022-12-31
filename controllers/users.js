const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
	res.render("users/register");
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password); //it takes the new user we created and add passwprd with salt and hush within
		//after we have done a user to register/create account we want to login, so we use this "login" function from passport in order our user to be logged in and not have to go back and wite his personla shit in order to log in
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome to Greece Club!");
			res.redirect("/clubs");
		});
	} catch (e) {
		//if there is an error then i want to flash and show this message and redirect me to register page
		req.flash("error", e.message);
		res.redirect("register");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login");
};

module.exports.login = (req, res) => {
	req.flash("success", "welcome back!");
	const redirectUrl = req.session.returnTo || "/clubs"; //here we tell that we will return to the page we were bbefore we log in or if we din't be in some page we will go as default to clubs page
	delete req.session.returnTo;
	res.redirect(redirectUrl); //so redirect me in one of two choices
};

//Here is the "Logout" where you exit and it's displayed the message Goodbye
module.exports.logout = (req, res) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash("success", "Goodbye!");
		res.redirect("/clubs");
	});
};
