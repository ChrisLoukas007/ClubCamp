//Don't Forget index.js is just an self - contained file so it's going to connect to Mongos and use my Model
const mongoose = require("mongoose");
const firstClubs = require("./firstClubs");
const Club = require("../models/club");

mongoose.connect("mongodb://localhost:27017/greece-club", {
	// useNewUrlParser: true,
	useUnifiedTopology: true,
	//useCreateIndex: true, it's not supported
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const seedDB = async () => {
	//με seedDB κάνω insert όλα τα firstClubs in monogDB
	await Club.deleteMany({});
	for (let i = 0; i < 20; i++) {
		const club = new Club({
			author: "635bf04f26df4fff9661bdd9", //my ID user
			location: `${firstClubs[i].location}`,
			title: `${firstClubs[i].title}`,
			entrancePrice: `${firstClubs[i].entrancePrice}`,
			description: `${firstClubs[i].description}`,
			geometry: {
				type: "Point",
				coordinates: [firstClubs[i].longitude, firstClubs[i].latitude], //as a default geometry coordinates because it must every club to have a location
			},
			images: [
				{
					url: "https://res.cloudinary.com/dndaagszd/image/upload/v1669919557/Greece-Club/dbadoysmcl3vdhu64bbr.jpg",
					filename: "Greece-Club/dbadoysmcl3vdhu64bbr",
				},
				{
					url: "https://res.cloudinary.com/dndaagszd/image/upload/v1671472718/Greece-Club/mx66rfeo7agc62wgoycg.jpg",
					filename: "Greece-Club/mx66rfeo7agc62wgoycg",
				},
			],
		});
		await club.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
