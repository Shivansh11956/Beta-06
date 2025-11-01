const express = require('express')
const app = express()
const path = require('path')
const multer = require("multer");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



const Workshop = require('./models/workshop')
const hackathon = require('./models/hackathon');
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

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));
app.get('/',(req,res) => {
    res.render("organiser")
})
app.get('/workshop',(req,res)=>{
    res.render('workshop')
})
app.get('/host/workshop',(req,res)=>{
    res.render('host_offline_workshop')
})
app.post('/host/workshop', upload.single("logo"),async (req, res) => {

    try {
        // ✅ Parse skills (sent as JSON string)
        const skillsArr = JSON.parse(req.body.skills || "[]");

        const workshop = new Workshop({
            orgName: req.body.orgName,
            workshopTitle: req.body.workshopTitle,
            url: req.body.url,
            description: req.body.description,
            skills: skillsArr,
            participationType: req.body.participationType,
            mode: req.body.mode,
            venue: req.body.venue,
            location: req.body.location,
            minSize: req.body.minSize,
            maxSize: req.body.maxSize,
            logo: req.file ? req.file.path : null,
            registrationDate : req.body.registrationDate,
            commenceDate : req.body.commenceDate,
            organiserName : req.body.organiserName,
            organiserDesignation : req.body.organiserDesignation,
            organiserEmail : req.body.organiserEmail,
            organiserNumber : req.body.organiserNumber 
                });
        res.json({
            success: true,
            message: "Workshop saved",
            fields: req.body,
            file: req.file
        });
        await workshop.save();

        // return res.json({ success: true, message: "Workshop Saved!", workshop });

        
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

app.get('/host/workshop/completed',(req,res)=>{
    res.render('host_workshop_complete')
})

app.get('/hackathon',(req,res)=>{
    res.render('hackathon')
})
app.get('/host/hackathon',(req,res)=>{
    res.render('host_hackathon')
})
app.post('/host/hackathon', upload.single("logo"),async (req, res) => {

    try {
        // ✅ Parse skills (sent as JSON string)
        const skillsArr = JSON.parse(req.body.skills || "[]");
        
        const hackat = new hackathon({
            orgName: req.body.orgName,
            hackathonTitle: req.body.hackathonTitle,
            url: req.body.url,
            description: req.body.description,
            skills: skillsArr,
            participationType: req.body.participationType,
            mode: req.body.mode,
            venue: req.body.venue,
            location: req.body.location,
            minSize: req.body.minSize,
            maxSize: req.body.maxSize,
            logo: req.file ? req.file.path : null,
            registrationDate : req.body.registrationDate,
            commenceDate : req.body.commenceDate,
            organiserName : req.body.organiserName,
            organiserDesignation : req.body.organiserDesignation,
            organiserEmail : req.body.organiserEmail,
            organiserNumber : req.body.organiserNumber ,
            stages : req.body.stages
                });
        res.json({
            success: true,
            message: "hackathon saved",
            fields: req.body,
            file: req.file
        });
        await hackat.save();

        // return res.json({ success: true, message: "Workshop Saved!", workshop });

        
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

app.get('/host/hackathon/completed',(req,res)=>{
    res.render("host_hackathon_completed")
})
app.get('/foryou',(req,res)=>{
    res.render('foryou')
})
app.listen(3000,()=>{
    console.log('running');
});