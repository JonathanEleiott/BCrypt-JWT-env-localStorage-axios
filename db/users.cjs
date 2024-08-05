/* eslint-disable no-undef */
const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async(username, password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);

    await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2);
    `, [username, encryptedPassword]);
  } catch(err) {
    console.log(err);
  }
}

const getUser = async(username, password) => {
  const { rows: [ user ] } = await client.query(`
    SELECT * FROM users
    WHERE username='${username}';
  `);

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if(user && isPasswordMatch) {
    const assignedToken = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return assignedToken;
  } else {
    const error = new Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

const getUserByToken = async(token) => {
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  
  const { rows: [ user ] } = await client.query(`
    SELECT id, username FROM users
    WHERE id=${userId}
  `);

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserByToken
}