const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Human = require('../models/human');
const Animal = require('../models/animal');
const Comment = require('../models/comment');
const Sequelize = require('sequelize');


exports.postCase = (req, res, next) => {
    const caseType = req.query.caseType;
    const name = req.body.name;
    const area = req.body.city;
    const address = req.body.address;
    const uniqueSign = req.body.uniqueSign;
    const description = req.body.description;
    const phone = req.body.mobileNumber;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const userId = req.body.userId;
    const image = req.file

    let imagePath;
    if (!image && caseType === "human") {
        imagePath = 'images/defaultUser.jpg'
    } else if (!image && caseType === "animal") {
        imagePath = 'images/deafaultAnimal.png'
    } else {
        imagePath = image.path
    }

    if(caseType === "human"){
        Human
            .create({ name, area, address, uniqueSign, description, phone, lat, lng, userId, image: imagePath})
            .then(result => {
                return res.status(201).json({ case: result, message: "human case was created successfully" });
            })
            .catch(error => {
                next(error);
            });
    } else if (caseType === "animal"){
        Animal
            .create({ species: name, area, address, uniqueSign, description, phone, lat, lng, userId, image: imagePath })
            .then(result => {
                return res.status(201).json({ case: result, message: "Animal case was created successfully" });
            })
            .catch(error => {
                next(error);
            });
    }
};

exports.getAllCases = (req, res, next) => {
    const caseType = req.query.caseType;

    if (caseType === "human") {
        Human
            .findAll({
                order: [['createdAt', 'DESC']]
            })
            .then(result => {
                return res.status(200).json({ cases: result, message: "all human cases were fetched successfully" });
            })
            .catch(error => {
                next(error);
            });
    } else if (caseType === "animal") {
        Animal
            .findAll({
                order: [['createdAt', 'DESC']]
            })
            .then(result => {
                return res.status(200).json({ cases: result, message: "all animal cases were fetched successfully" });
            })
            .catch(error => {
                next(error);
            });
    }
};

exports.getSingleCase = (req, res, next) => {
    const caseId = req.params.caseId;
    const caseType = req.query.caseType;
    if (caseType === "human") {
        Human
            .findOne({
                where: {
                    id: caseId
                },
                include: [
                    {
                        model: User,
                        attributes: ['firstName', 'lastName']
                    },{
                        model: Comment,
                        attributes: ['content', 'createdAt'],
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'firstName', 'image'],
                                as: 'user'
                            }
                        ]
                    }],
                order: [['comments', 'createdAt', 'DESC']]
            })
            .then(result => {
                return res.status(200).json({ case: result, message: "a human case was fetched successfully" });
            })
            .catch(error => {
                next(error);
            });
    } else if (caseType === "animal") {
        Animal
            .findOne({
                where: {
                    id: caseId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }, {
                        model: Comment,
                        attributes: ['content', 'createdAt'],
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'firstName', 'image'],
                                as: 'user'
                            }
                        ]
                    }],
                order: [['comments', 'createdAt', 'DESC']]
            })
            .then(result => {
                return res.status(200).json({ case: result, message: "an animal case was fetched successfully" });
            })
            .catch(error => {
                next(error);
            });
    }
};

exports.postComment = (req, res, next) => {
    const comment = req.body.comment;
    const caseId = req.body.caseId;
    const caseType = req.body.caseType;
    const userId = req.body.userId;
    if(caseType === "human"){
        Comment
            .create({ content: comment, humanId: caseId, animalId: null, userId })
            .then(result => {
                return res.status(201).json({ comment: result, message: "comment was created successfully" });
            })
            .catch(error => {
                next(error);
            });
    }else if(caseType === "animal"){
        Comment
            .create({ content: comment, humanId: null, animalId: caseId, userId: userId })
            .then(result => {
                return res.status(201).json({ comment: result, message: "comment was created successfully" });
            })
            .catch(error => {
                next(error);
            });
    }
};
