require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/secretDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((error) => {
        if(error) {
            console.log(error);
        } else {
            res.render('secrets');
        }
    });

});


app.post('/login', (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
        email: userName,
        password: password
    }, (error, userFound)=> {
        if(error){
            console.log(error);
        } else{
            if(userFound){
                if(userFound.password === password){
                    res.render('secrets');
                }
            }
        }
    });
});


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})