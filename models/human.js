const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Human = sequelize.define(
    "human",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        area: {
            type: Sequelize.ENUM('مصر', 'الامارات', "السعودية"),
            defaultValue: 'مصر',
            allowNull: false
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        uniqueSign: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING,
            defaultValue: "images/defaultUser.jpg"
        },
        phone: Sequelize.STRING,
        lat: {
            type: Sequelize.DECIMAL(9, 6),
            allowNull: false
        },
        lng: {
            type: Sequelize.DECIMAL(9, 6),
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = Human;