const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Comment = sequelize.define(
    "comment",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = Comment;
