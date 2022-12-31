module.exports = (func) => {
	//(1)
	return (req, res, next) => {
		//(2)
		func(req, res, next).catch(next); //(2)
	};
};

//We return a function (1) that accepts a fucntion (2) and then it executes that function (3) . But if catches any errors and passes it to next .
//We use this to wrap our async funcitons
