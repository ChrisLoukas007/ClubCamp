const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User", //remember : "ref" is used in order to know Mongoose which model to use during population in our case User.js model
	},
});

module.exports = mongoose.model("Review", reviewSchema);
