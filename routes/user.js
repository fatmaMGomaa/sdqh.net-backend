const express = require("express");
const { body } = require("express-validator/check")

const userControllers = require("../controllers/user");
const User = require('../models/user');
const Human = require('../models/human');
const isAuthenticated = require('../middleware/is-auth');

const router = express.Router();

router.post('/addCase', isAuthenticated, userControllers.postCase)
router.get('/allCases', userControllers.getAllCases)
router.get('/singleCase/:caseId', userControllers.getSingleCase)
router.post('/addComment', isAuthenticated, userControllers.postComment)


module.exports = router;