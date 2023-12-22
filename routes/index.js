const express = require('express');
const app = express()
const userModel = require('./users')
const postsModel = require('./posts')
const passport = require('passport');
const upload = require('./multer')


const localstrategy = require('passport-local');
const users = require('./users');
passport.use(new localstrategy(userModel.authenticate()))


app.get('/',(req,res,next)=>{
    res.render('index',{title : 'Express'})
})

app.post('/register',(req,res)=>{
    const {username,email,fullname} = req.body;
    const userdata = new userModel({
        username,
        email,
        fullname
    })

    userModel.register(userdata,req.body.password)
    .then(function(){
        passport.authenticate('local')(req,res,function(){
            console.log(userdata);
            res.redirect('/profile')
        })
    })
})

app.get('/login',(req,res)=>{
    
    const content=req.flash('error');
    console.log(content);
    res.render('signup',{content})
})


app.post('/login',passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
    failureFlash:true
}),(req,res)=>{
})


app.get('/profile',isLoggedin,async (req,res,next)=>{
    const user = await userModel.findOne({
        username:req.session.passport.user
    }).populate('posts')
    // console.log(user);
    res.render('profile',{user})
})

app.get('/feed',(req,res,next)=>{
    res.render('feed')
})


app.post('/upload',isLoggedin,upload.single('file'),async (req,res,next)=>{

    if(!req.file){
        return res.status(404).send('no files were given')
    }


    const user = await userModel.findOne({username: req.session.passport.user})
    const postdata = await postsModel.create({
        image : req.file.filename,
        postText : req.body.filecaption,
        user : user._id

    })
    console.log(postdata);

    user.posts.push(postdata._id)
    await user.save()
    res.redirect('/profile')




})

app.get('/logout',(req,res)=>{
    req.logout(function(err){
        if(err) {
            return next(err)
        }
        res.redirect('/')
    })
})



function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    } 
    res.redirect('/')
    
}


module.exports=app