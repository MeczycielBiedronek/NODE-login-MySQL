if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const  methodOverride = require('method-override')
const mysql = require('mysql');
var bodyParser = require('body-parser');
const PORT = 5000;
const users = [  {
    id: '1660894801721',
    name: 'Fistah',
    email: 'john@gmail.com',
    password: '$2b$10$5xxdgbUf9qpIVIMoI0r9ZeCtuEb4f.EV2h.0FGAl1hX0wQsQT.vUu'
  }]

//   let emalia = 

//   console.log(users.find(user => user.email === 'asd@asd'), users.find(user => user.id === '1660894801721'))

// DATABASE CONNECTION

const db = mysql.createConnection({
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'nodemysql'
});

db.connect((err)=>{
    if(err){ throw err;
    }
    console.log('MySQL connected')
});

// let dupa = email => db.query(`SELECT email FROM users_pl WHERE email = ${email}`, result)
// console.log(dupa(`'fistah@gmail.com'`))

const initializePassport = require('./passport-config')
const { json } = require('body-parser')


// db.query(`SELECT * FROM users_pl WHERE email = 'fistah@gmail.com'`, (err, result) => {
//     // if (err) throw err;
//     console.log(result[0]);})
let email = "john@gmail.com"
console.log(users.find(user => user.email === email)) // Replace with SQL Query
// console.log(db.query(`SELECT * FROM users_pl WHERE email = 'fistah@gmail.com'`, (err, result) => {
//    result
// }))
let getEmailFromDB = db.query(`SELECT * FROM users_pl WHERE email = 'fistah@gmail.com'`, (err, result) => { 
    result})
    console.log(getEmailFromDB())

initializePassport(
    passport, 
    // email =>  ,
    // id =>  db.query(`SELECT * FROM users_pl WHERE id = ${id}`, (err, result) => {
    //     result})

    )
    // email =>  users.find(user => user.email === email), // Replace with SQL Query
    // id =>  users.find(user => user.id === id)


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


// Routes

app.get('/', checkAuthenticated, (req, res)=> {
    res.render('index.ejs', {name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res)=> {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true

}))

app.get('/register', checkNotAuthenticated, (req, res)=> {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res)=> {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10)

        let userData = {
            name: `${req.body.name}`,
            email: `${req.body.email}`,
            password: `${hashedpassword}`
        };
        let sql = 'INSERT INTO users_pl SET ?';
        // users.push({
        //     id: Date.now().toString(),
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: hashedpassword
        // })
        let query = db.query(sql, [userData], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send('Another User Added...');
        })

        // res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err) }
      res.redirect('/')
    })
  })

app.get('/getusers', (req, res) => {
    let sql = 'SELECT id, name FROM users';
let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});

// function getUsersFromDataBase(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/')
//     } 
//      next()
// }


// ()=>{
//     let sql = 'SELECT * FROM users_pl';
//     let users = db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         // res.send(result);
//     })
// },
function getUser(email) {
    let sql = `SELECT * FROM users_pl WHERE email = '${email}'` ;
    let usr = db.query(sql, (err, result) => {
        if (err) throw err;
        users.push(usr)
        console.log(users)
        
        // res.send(result);
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } 
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    } 
     next()
}

app.listen(PORT, console.log(`Server running on port ${PORT}`))