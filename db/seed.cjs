/* eslint-disable no-undef */
const client = require('./client.cjs');
const { createUser } = require('./users.cjs');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL
      );
    `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  console.log('CONNECTED TO DB');

  await dropTables();
  console.log('TABLES DROPPED');

  await createTables();
  console.log('TABLES CREATED');

  await createUser('larry', 'larry1');
  await createUser('curly', 'curly1');
  await createUser('moe', 'moe1');
  await createUser('lucy', 'lucy1');
  console.log('USERS CREATED');

  await client.end();
  console.log('DISCONNECTED FROM DB')
}

syncAndSeed();