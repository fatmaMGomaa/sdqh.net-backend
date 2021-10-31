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
            type: Sequelize.TEXT,
            defaultValue: "https://34yigttpdc638c2g11fbif92-wpengine.netdna-ssl.com/wp-content/uploads/2016/09/default-user-img.jpg"
        }
    },
    {
        timestamps: true
    }
);

module.exports = User;
