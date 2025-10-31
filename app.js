const express = require('express')
const app = express()
const path = require('path')

let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');




app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
require('dotenv').config();


app.get('/',(req,res) => {
    res.render("organiser")
})
app.get('/workshop',(req,res)=>{
    res.render('workshop')
})
app.listen(3000,()=>{
    console.log('running');
});