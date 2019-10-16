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
    const image = req.body.image
    // const image = req.file

    let imagePath;
    if (!image && caseType === "human") {
        imagePath = 'https://34yigttpdc638c2g11fbif92-wpengine.netdna-ssl.com/wp-content/uploads/2016/09/default-user-img.jpg'
    } else if (!image && caseType === "animal") {
        imagePath = 'https://i.pinimg.com/originals/14/dd/9b/14dd9bbad0c7fd09ed76c5c078e2f8d4.png'
    } else {
        imagePath = image
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

exports.getUserCases = (req, res, next) => {
    const userId = req.query.userId;
    let humanCases, animalCases;

    if (!userId) {
        const error = new Error("you do not have right to get those cases");
        error.statusCode = 403;
        throw error;
    }
    Human
        .findAll({
            where: {userId: userId}
        })
        .then(result => {
            humanCases = result;
        })
        .catch(error => {
            next(error);
        });
    Animal
        .findAll({
            where: { userId: userId }
        })
        .then(cases => {
            animalCases = cases;
            return res.status(200).json({ humanCases: humanCases, animalCases: animalCases, message: "all user cases were fetched successfully" });
        })
        .catch(error => {
            next(error);
        });
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
exports.deleteCase = (req, res, next) => {
    const caseId = req.params.caseId;
    const userId = +req.params.userId;
    const caseType = req.query.caseType;
    if (caseType === "human"){
        Human.findByPk(caseId)
            .then(theCase => {
                if (!theCase) {
                    const error = new Error('Could not find the human case.');
                    error.statusCode = 404;
                    throw error;
                }
                if(userId === theCase.userId){
                    return theCase.destroy();
                }else {
                    const error = new Error("you do not have right to delete this case");
                    error.statusCode = 403;
                    throw error;
                }
            })
            .then(result => {
                console.log(result);
                res.status(200).json({ message: 'Deleted the human case.' });
            })
            .catch(err => {
                next(err);
            });
    } else if (caseType === "animal"){
        Animal.findByPk(caseId)
            .then(theCase => {
                if (!theCase) {
                    const error = new Error('Could not find the animal case.');
                    error.statusCode = 404;
                    throw error;
                }
                if (userId === theCase.userId) {
                    return theCase.destroy();
                } else {
                    const error = new Error("you do not have right to delete this case");
                    error.statusCode = 403;
                    throw error;
                }
            })
            .then(result => {
                console.log(result);
                res.status(200).json({ message: 'Deleted the animal case.' });
            })
            .catch(err => {
                next(err);
            });
    }
    
};

exports.editCase = (req, res, next) => {
    const caseId = req.params.caseId;
    const userId = +req.params.userId;
    const caseType = req.query.caseType;
    const name = req.body.name;
    const area = req.body.city;
    const address = req.body.address;
    const uniqueSign = req.body.uniqueSign;
    const description = req.body.description;
    const phone = req.body.mobileNumber;
    const image = req.body.image
    if (caseType === "human") {
        Human.findByPk(caseId)
            .then(theCase => {
                if (!theCase) {
                    const error = new Error('Could not find the human case.');
                    error.statusCode = 404;
                    throw error;
                }
                if (userId !== theCase.userId) {
                    const error = new Error("you do not have right to edit this case");
                    error.statusCode = 403;
                    throw error;
                } else {
                    return theCase.update({ name, area, address, uniqueSign, description, phone, image})
                }
            })
            .then(result => {
                console.log(result);
                res.status(200).json({case: result, message: 'edited the human case.' });
            })
            .catch(err => {
                next(err);
            });
    } else if (caseType === "animal") {
        Animal.findByPk(caseId)
            .then(theCase => {
                if (!theCase) {
                    const error = new Error('Could not find the animal case.');
                    error.statusCode = 404;
                    throw error;
                }
                if (userId !== theCase.userId) {
                    const error = new Error("you do not have right to edit this case");
                    error.statusCode = 403;
                    throw error;
                } else {
                    return theCase.update({ species: name, area, address, uniqueSign, description, phone, image })
                }
            })
            .then(result => {
                console.log(result);
                res.status(200).json({ case: result, message: 'edited the animal case.' });
            })
            .catch(err => {
                next(err);
            });
    }

};