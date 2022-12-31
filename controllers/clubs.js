const Club = require("../models/club");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

//here is about clusterMap without populate('popupText') we can't click above the map and appear the name of club and to visit the page
module.exports.index = async (req, res) => {
	const clubs = await Club.find({});
// .populate({
// 		path: "popupText",
// 		strictPopulate: false,
	// });
	res.render("clubs/index", { clubs });
};

//exei simasia i seira edo giati to new prepei na nai pio pano apo to id
module.exports.renderNewForm = (req, res) => {
	res.render("clubs/new");
};

//auto to grafeis gia na gini i eisagoti tou kainourgiou club kai na emfanisei ta stoixeia tou ola
module.exports.createClub = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.club.location, //here is the location-address of every club not the coordinates!
			limit: 1, //here we tell that we want until 1 result not more
		})
		.send();
	const club = new Club(req.body.club);
	club.geometry = geoData.body.features[0].geometry;
	club.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	club.author = req.user._id;
	await club.save();
	console.log(club);
	req.flash("success", "Successfully made a new club!");
	res.redirect(`/clubs/${club._id}`);
};
//req.flash("success", "Successfully made a new club!");  => εδώ πέρα γράφω και τι μήνυμα θέλω να βγει εφόσον επιλεχτεί το success κάτι που θα γίνει εφόσον έχει φτιαχτεί σωστά το νέο κλαμπ

//gia show pos einai to club oi plirofories
module.exports.showClub = async (req, res) => {
	const club = await Club.findById(req.params.id) //we write all these because we want .....................
		.populate({
			path: "reviews",
			options: {
				//i created that in order to show me the most recent review on top
				sort: { _id: -1 },
			},
			populate: {
				path: "author",
				strictPopulate: false,
			},
		})
		.populate("author"); //populate(author) because we want to populate in order to give me the author and now club has access to author as the review
	if (!club) {
		req.flash("error", "Cannot find that club!"); //εδω το flash λειτουργει για την αντίθετη περίπτωση
		return res.redirect("/clubs");
	}
	res.render("clubs/show", { club });
};

//gia edit sto club
module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const club = await Club.findById(id);
	if (!club) {
		req.flash("error", "Cannot find that club!");
		return res.redirect("/clubs");
	}
	res.render("clubs/edit", { club });
};

//SOS we use method-override and this because we want to manage to edit and then save the club without creating new or different id object
//so in edit.ejs as you will see we use ?method=PUT in order to trick the editor
module.exports.updateClub = async (req, res) => {
	const { id } = req.params;
	console.log(req.body);
	const club = await Club.findByIdAndUpdate(id, {
		...req.body.club,
	});
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	club.images.push(...imgs); //we are not overwritting all images , we just push it ,on the existing images!
	await club.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			//for every filename go to coudinary and delete the deletedImages-files
			await cloudinary.uploader.destroy(filename);
		}
		await club.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		}); //in order to delete the images we want and at the backend era , the thing in {{{{{}}}}} says that we want to delete only the images that is inside the deleteImages array
		console.log(club);
	}
	req.flash("success", "Successfully updated club!");
	res.redirect(`/clubs/${club._id}`);
};

//gia diagrafi
module.exports.deleteClub = async (req, res) => {
	const { id } = req.params;
	await Club.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted club");
	res.redirect("/clubs");
};
