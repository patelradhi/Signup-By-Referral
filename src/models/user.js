const mongoose = require('mongoose');

//.................creating Schema........................../

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		age: {
			type: Number,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
		},
		referralCode: {
			type: String,
		},
		referredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			default: null,
		},
		bonus: [
			{
				type: Number,
				ref: 'user',
				default: null,
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

//.............exporting schema......................./

module.exports = mongoose.model('User', userSchema);
