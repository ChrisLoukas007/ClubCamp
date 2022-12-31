const express = require("express");
const router = express.Router();
const clubs = require("../controllers/clubs");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateClub } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Club = require("../models/club");

//NOTES about what they do each function
//"isLoggedIn" is a middleware which check if someones has auth and if this is true then he can have access in clubs page otherwise something is wrong

router
	.route("/") //route.route is fancy way to diplay or to group things together that has the same path , as here "get" and "post" has "/" as same path
	.get(catchAsync(clubs.index))
	//above here .post is telling the controls that will become in order to upload what we want , it means that they will check fisrt if isLoggeIn ,
	//after that if it;s true we will can upload the images after we will check if is validateClub and after that we will create it.
	.post(
		isLoggedIn,
		upload.array("image"),
		validateClub,
		catchAsync(clubs.createClub)
	);

router.get("/new", isLoggedIn, clubs.renderNewForm);

router
	.route("/:id") //to idio me to parapano sxolio
	.get(catchAsync(clubs.showClub))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateClub,
		catchAsync(clubs.updateClub)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(clubs.deleteClub));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(clubs.renderEditForm));

module.exports = router;
