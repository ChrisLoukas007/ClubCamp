const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

//we do that because we want to pass in the result of requiring that package that we installed in to UserSchema
//And this is going to add on to our Schema : Username , a field of password and it's going to make sure that are unique
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
