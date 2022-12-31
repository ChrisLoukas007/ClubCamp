//Remember this folder is about χρησιμότητα - helper για τον κώδικα
class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

module.exports = ExpressError;
