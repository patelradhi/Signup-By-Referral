const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { hashPassword } = require('../utils');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//..............function for generate referralcode................../

const generateReferralCode = (codeLength) => {
	const charactersAvailable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

	let referralCode = '';

	for (let i = 0; i < codeLength; i++) {
		referralCode += charactersAvailable[Math.floor(Math.random() * charactersAvailable.length)];
	}

	return referralCode;
};

//........................signUp....................................../

exports.signUp = async (req, res) => {
	try {
		//Destructured fields from req.body

		const { firstName, lastName, age, email, password, referralCode } = req.body;

		//validatation

		if (!firstName || !lastName || !age || !email || !password) {
			return res.json({
				success: false,
				message: 'Please fill the all details CareFully',
			});
		}

		//check  user allready exist or not

		const checkUser = await User.findOne({ email });
		if (checkUser) {
			return res.json({
				success: false,
				message: 'User allready exist',
			});
		}

		const ans = await hashPassword(password, 10);

		//validation(find user by referral code if any user wants to signUp by other users referralcode)

		const referreduser = await User.findOne({ referralCode });
		if (!referreduser) {
			res.json({
				success: false,
				message: 'Not found any referredUser with given referralCode',
			});
		} else {
			let bonus = 0;
			bonus = bonus + 100;
			const userBonus = await User.updateOne({ referralCode }, { $push: { bonus: bonus } }, { new: true })
				.populate('bonus')
				.exec();
			console.log(bonus);
		}

		//creat entry in dataBase

		const user = await User.create({
			firstName,
			lastName,
			age,
			email,
			password: ans,
			// password: ans,
			profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
			referralCode: generateReferralCode(6),
			referredBy: referreduser._id,
		});

		//response
		res.json({
			success: true,
			message: 'Account created successfully',
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while creat an account',
		});
	}
};

//...............................logIn................................../

exports.logIn = async (req, res) => {
	try {
		//Destructure fields from req.body

		const { email, password } = req.body;

		//validation

		if (!email || !password) {
			return res.json({
				success: false,
				message: 'Please full fill all the details very carefully',
			});
		}

		// check user allready exist or not

		const userExist = await User.findOne({ email });
		console.log(userExist);
		if (!userExist) {
			return res.json({
				success: false,
				message: 'User not exist please signUp first',
			});
		}

		//compare password

		const compare = await bcrypt.compare(password, userExist.password);

		if (compare) {
			//creat jwt token
			const payload = {
				email: userExist.email,
				id: userExist._id,
			};
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: '3h',
			});

			//response

			let Options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			res.cookie('token', token, Options).json({
				success: true,
				message: 'User login successfully',
				data: {
					...userExist._doc,
					token,
				},
			});
		} else {
			res.json({
				success: false,
				message: 'User not login successfully',
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Uound some error in logIn acccount',
		});
	}
};

//.............................getAll referred user...................../

exports.getAllReferredUser = async (req, res) => {
	try {
		// Destructure fields from req.body
		const { _id } = req.body;
		console.log(_id);

		//find referreduser
		const referreduser = await User.find({ referredBy: _id }); //

		for (let user of referreduser) {
			if (user.bonus.length > 0) {
				let totalBonus = 0;
				for (let bonus of user.bonus) {
					totalBonus += bonus;
				}
				user._doc.totalBonus = totalBonus;
			}
		}

		//response

		res.status(200).json({
			success: true,
			data: referreduser,
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while getting user',
		});
	}
};

//.....................................get all user................../

exports.getAllUser = async (req, res) => {
	try {
		const allUser = await User.find({}, { _id: 0, password: 0, referredBy: 0 });

		for (let user of allUser) {
			if (user.bonus.length > 0) {
				let totalBonus = 0;
				for (let bonus of user.bonus) {
					totalBonus += bonus;
				}
				user._doc.totalBonus = totalBonus;
			}
		}

		//response
		res.json({
			success: true,
			data: allUser,
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while getting user',
		});
	}
};
