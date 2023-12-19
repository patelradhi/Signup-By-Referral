//..........import......................../

const express = require('express');
const router = express.Router();

//...................import controllers................/

const { signUp, logIn, getAllReferredUser, getAllUser } = require('../controllers/user');

//.....................Handling HTTP request for signup  (Post API).................//

router.post('/signUp', signUp);

//.....................Handling HTTP request for logIn  (Post API).................//

router.post('/logIn', logIn);

//.....................Handling HTTP request for  getAllReferredUser (get API).................//

router.get('/getAllReferredUser', getAllReferredUser);

//.....................Handling HTTP request for  getAllUser (get API).................//

router.get('/getAllUser', getAllUser);

//***********************Making router public********************//

module.exports = router;
