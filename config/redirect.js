// the middleware function
module.exports = function() {

	return function(req, res, next) {
		console.log(req.session);
		next();
	}

};