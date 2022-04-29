const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const cors = require('cors');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const { REFUSED } = require('dns');

const db = knex({
  client: `pg`,
  connection: {
        host :  ` 127.0.0.1`,
        user: `andrea`,
        password: ``,
        database : `smart-brain`
  }
});

const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> {res.send(database.users) })
app.post('/signin', signin.handleSignin(db, bcrypt)(req, res)) 
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) 
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) }) 
app.put('/image', (req, res) => { image.handleImage(req, res, db)})    
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})



