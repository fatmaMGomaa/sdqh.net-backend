const path = require('path');

const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');
const sequelize = require('./util/database');

const app = express();

const User = require('./models/user');
const Human = require('./models/human');
const Animal = require('./models/animal');
const Comment = require('./models/comment');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use(require('body-parser').text());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(authRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


//relations btw user and humanCases
User.hasMany(Human);
Human.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//relation btw user and AnimalCase
User.hasMany(Animal);
Animal.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//relations btw user and Comment
User.hasMany(Comment);
Comment.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//relations btw Human and Comment
Human.hasMany(Comment);
Comment.belongsTo(Human, { constraints: true, onDelete: 'CASCADE' });
//relations btw Animal and Comment
Animal.hasMany(Comment);
Comment.belongsTo(Animal, { constraints: true, onDelete: 'CASCADE' });

sequelize
    .sync({ force: false })
    .then(result => {
        console.log(result);
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });
