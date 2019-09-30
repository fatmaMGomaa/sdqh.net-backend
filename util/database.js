const Sequelize = require('sequelize');

const { DB_NAME, DB_USER, SECRET, DATABASE_URL } = process.env;
let sequelize;
if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: true
        }
    })
} else {
    sequelize = new Sequelize(DB_NAME, DB_USER, SECRET, {
        dialect: 'postgres',
        host: 'localhost'
    });
}
module.exports = sequelize;