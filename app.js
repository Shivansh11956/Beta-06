const express = require('express')
const app = express()
const path = require('path')
const multer = require("multer");


let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');




app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
require('dotenv').config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.get('/',(req,res) => {
    res.render("organiser")
})
app.get('/workshop',(req,res)=>{
    res.render('workshop')
})
app.get('/host/offline_workshop',(req,res)=>{
    res.render('host_offline_workshop')
})
app.post('/host/workshop', upload.single("logo"), (req, res) => {

    console.log("Form Fields:", req.body);
    console.log("File Info:", req.file);

    res.json({
        message: "Data received",
        fields: req.body,
        file: req.file
    });
});



app.listen(3000,()=>{
    console.log('running');
});