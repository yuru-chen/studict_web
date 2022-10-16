require('dotenv').config({path: '.env'});


module.exports = {
    mysql: {
      host: process.env.HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE
    },
    internet: {
      webKey: process.env.WebKey,
      webTKey: process.env.WebTKey
    }
}