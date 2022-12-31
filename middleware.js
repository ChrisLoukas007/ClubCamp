const { ClubSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Club = require("./models/club");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
	//we use it in order to chech is someione is authenticated so he can have access to the next page otherwiese He must signed in first
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl; //here we use returnTo so we can return to the place where we were before log in or verifying that are authenticated , so we tell returnTo=  req.originalUrl
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
};

//we use it to know If someone is Logged In
//So validateClub is created for... and it has different reason from client-side validation which is to show the red color when you don't
//complete some label for the creastion/editing of some Club
//And because we don''t want to write code in order to check every single bit eg. if (req.body.club.price == empty) then do this .....
//So if we have error ClubSchema.validate(req.body) will find it and after that we will get back the details which may be only one or more
//thanks to maps and join(,)  => error.details.map((el) => el.message).join(",") If there is one we will throw an ExpressError and we will continue
//thanks to mext()
//diaforetika logia :
//function gia na kano validate=νομιμοποιήση Club pou kano insert
//εχω φτιαξει αυτη την συναρτηση ώστε να αποφύγω να προσθέσω στα async functions σε όλα το try-catch μιας κι έτσι
//θα αποφύγω την κατάσταση αυτή θα το βελτιστοποιήσω και σε χώρο και χρόνο !

module.exports.validateClub = (req, res, next) => {
	const { error } = ClubSchema.validate(req.body);
	console.log(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const club = await Club.findById(id);
	if (!club.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/clubs/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/clubs/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
