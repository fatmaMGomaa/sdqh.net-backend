const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define(
    "user",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birthDate: Sequelize.DATEONLY,
        gender: {
            type: Sequelize.ENUM('male', 'female'),
            defaultValue: 'male'
        },
        image: {
            type: Sequelize.STRING,
            defaultValue: "images/defaultUser.jpg"
        }
    },
    {
        timestamps: true
    }
);

module.exports = User;
