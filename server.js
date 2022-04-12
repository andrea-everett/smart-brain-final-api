const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require ('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5438, 
      user: 'postgres',
      password: 'postgres',
      database : 'postgres'
    }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (_req, res)=> { res.send('db.users') });

app.post('/signin', (req, res) => { signin.handleSignin( req, res, db, bcrypt) });

app.post('/register', (req, res)=> { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) }); 


app.listen(3000, ()=> {
     console.log('hello');
})


