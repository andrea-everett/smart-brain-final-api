const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const cors = require('cors');
const salt = bcrypt.genSaltSync(10);

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  }
  // connection: {
  //   connectionString:
  //     process.env.DATABASE_URL,
  //     ssl: {
  //       rejectUnauthorized:false
  //     }   
  // }

});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('it is working');
});

app.post('/signin', (req, res) => {signin.handleSignin(db, bcrypt)(req, res) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, salt) }) 
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) }) 
app.put('/image', (req, res) => { image.handleImage(req, res, db)})    
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log(`server is running on port ${process.env.PORT}`);
})

