const express = require('express')
const app = express()
const path = require('path')
const multer = require("multer");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { toVector, cosine } = require("./utils/vectorUtils");

const Workshop = require('./models/workshop')
const hackathon = require('./models/hackathon');
const userModel = require('./models/user')
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


const isLogged = (req, res, next) => {
    let token = req.cookies.user_token;
    if (!token) {
      return res.redirect('/user/login');
    }
  
    jwt.verify(token, 'shhh', (err, user_email) => {
      if (err) {
        return res.redirect('/user/login');
      }
      req.user = user_email;
      next();
    });
};

app.use('/uploads', express.static('uploads'));
app.get('/organiser',(req,res) => {
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


        
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});
app.post('/user/create_user_account',async (req,res)=>{
    let {fname,lname,email,password} = req.body;
  
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createdUser = await userModel.create({
                firstName : fname,
                lastName : lname,
                email : email,
                password : hash,
                interests : ['AR/VR']
            }) 
            let token = jwt.sign({email : email},'shhh')
            res.cookie('user_token',token)
            res.redirect('/foryou')
        })
    })    
})
app.post('/user/login-account',async (req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email:email});
    if(!user){
        return res.redirect('/user/login')
    }
    bcrypt.compare(password, user.password, (err, isValid) => {
        if (err){
            console.error("Error comparing passwords:", err);
            return res.redirect('/user/login');
        }
        if (!isValid) {
            console.log("Invalid credentials.");
            return res.redirect('/user/login');
        }
        let token = jwt.sign({ email: user.email }, 'shhh', { expiresIn: '7d' });
        res.cookie('user_token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect('/foryou');
    });
})
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


        
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

app.get('/host/hackathon/completed',(req,res)=>{
    res.render("host_hackathon_completed")
})
app.get('/foryou', isLogged, async (req, res) => {
  
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) return res.send("User not found");

  
  const userVector = toVector(user.interests || []);
  console.log(user.interests);

  
  const workshops = await Workshop.find();

 
  const scored = workshops.map(w => {
    const workshopVector = toVector(w.skills || []);
    return {
      workshop: w,
      score: cosine(userVector, workshopVector)
    };
  });

 
  const sorted = scored.sort((a, b) => b.score - a.score);

  
  res.render("foryou", { workshops: sorted });
});

app.get('/',(req,res)=>{
    res.render('landing')
})

app.get('/user/login',(req,res)=>{
    res.render('user_login')
})
app.get('/create/user',(req,res)=>{
    res.render('create_user')
})
app.get('/set_preferences',(req,res)=>{
    res.render('set_preferences')
})
app.get('/user/logout',(req,res)=>{
    res.cookie('user_token','');
    res.redirect('/')
})
app.listen(3000,()=>{
    console.log('running');
});