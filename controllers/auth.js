const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator/check');

const User = require("../models/user");
const { TOKENSECRET } = process.env;

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const birthDate = req.body.birthDate;
    const image = req.file

    let imagePath;
    if (!image) {
        imagePath = 'images/defaultUser.jpg'
    } else {
        imagePath = image.path
        console.log(imagePath)
    }
    User.findOne({
        where: {
            email: email
        }
    })
        .then(user => {
            if (user) {
                const error = new Error(`Email: ${email} is already taken.`);
                error.statusCode = 401;
                throw error;
            }
            bcrypt
                .hash(password, 10)
                .then(hashPw => {
                    return User.create({
                        email,
                        firstName,
                        lastName,
                        password: hashPw,
                        birthDate,
                        gender,
                        image: imagePath
                    });
                })
                .then(result => {
                    const token = jwt.sign(
                        {
                            email: email,
                            userId: result.id
                        },
                        TOKENSECRET,
                        { expiresIn: "1h" }
                    );
                    res.status(201).json({ token: token, user: result, message: "user has been created" });
                })
                .catch(error => {
                    next(error);
                });
        })
        .catch(error => {
            next(error);
        });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({
        where: {
            email: email
        }
    })
        .then(user => {
            if (!user) {
                const error = new Error(`Account with this email ${email} not found.`);
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Password is incorrect.");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser.id
                },
                TOKENSECRET,
                { expiresIn: "1h" }
            );
            res.status(200).json({ token: token, user: loadedUser, message: "logged in successfully" });
        })
        .catch(error => {
            next(error);
        });
};
