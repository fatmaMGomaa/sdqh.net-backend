const express = require("express");
const { body } = require("express-validator/check")

const authControllers = require("../controllers/auth");
const isAuthenticated = require('../middleware/is-auth');

const router = express.Router();

router.get('/tokenValidation', isAuthenticated, authControllers.tokenValidation);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .trim()
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
], authControllers.postSignup)

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
], authControllers.postLogin)

router.put('/updateUser', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('newPassword')
        .trim()
        .isLength({ min: 5 })
], authControllers.editUser)

module.exports = router;