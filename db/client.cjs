/* eslint-disable no-undef */
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);

module.exports = client;