const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//We created an ImageSchema but not an Image model, we don't have to export it because it's not gonna be use for ClubSchema
const ImageSchema = new Schema({
	url: String,
	filename: String,
});

//On every image I want to add thumbnail to have w ("weight") 200pixels and
//Also the reason why we use "virtual" is because we don't need to store the "/upload/w_200" in our model or in the database because it's
//just derived from the infromation we're already storing
ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200"); //"this" will refer to the particular image so i can access this url
});
//Conclusion : with the above we just say that every image we will have (DYNAMICALLY) w=200 pixels , we wil edit the image to appear as we want

//we write it because by default Mongoose does not include virtuals when you convert a document to JSON, so you need to set the toJSON
const opts = { toJSON: { virtuals: true } };

const ClubSchema = new Schema({
	title: String,
	images: [ImageSchema],
	geometry: {
		type: {
			type: String,
			enum: ["Point"], //location.type must be Point!
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	entrancePrice: String,
	description: String,
	location: String,
	city: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	// latitude: Number,
	// longitude: Number,
},opts);

//we return a link here in order to appear when we clikc on the map the point and that's going to take us in the club.page of this point
//so we have defined this nice virtual prpoperty that is just going to include some markup now for that pop on every single club and popUpMarkup is dynamic
ClubSchema.virtual('properties.popUpMarkup').get(function () {	
 return `<strong><a href="/clubs/${this._id}">${this.title}</a><strong><p>${this.description.substring(0, 20)}...</p>`
});

ClubSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Club", ClubSchema);
