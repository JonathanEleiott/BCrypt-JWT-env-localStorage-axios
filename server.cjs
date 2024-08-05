/* eslint-disable no-undef */
const { getUser, getUserByToken } = require('./db/users.cjs');

require('dotenv').config()

const client = require('./db/client.cjs');
client.connect();

const express  = require('express');
const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.post('/api/v1/login', async(req, res, next) => {
  try {
    console.log('REQ BODY', req.body);
    const { username, password } = req.body;
    const assignedToken = await getUser(username, password);
    res.send(assignedToken);
  } catch(err) {
    next(err);
  }
});

app.get('/api/v1/login', async(req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await getUserByToken(token);
    res.send(user);
  } catch(err) {
    next(err);
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));