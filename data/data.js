const { Pool } = require('pg'); //Pool chamada de todas as conexoes do banco
require('dotenv').config();// chamada do dotenv

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
})

module.exports = {
    pool
}