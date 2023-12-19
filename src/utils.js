//function for hash password

const bcrypt = require('bcrypt');

exports.hashPassword = (password, num) => {
	try {
		let hashPassword = bcrypt.hash(password, num);
		return hashPassword;
	} catch (error) {
		console.log(error);
	}
};
