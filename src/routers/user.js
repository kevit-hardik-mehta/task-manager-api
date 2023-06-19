const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const multer = require('multer');
const sendWelcomeEmail = require('../emails/account')
const router = new express.Router;

router.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/users',async (req,res) =>{
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})    
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens =  req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll',auth,async (req,res) => {
    try {
        req.user.tokens = [];
        
        await req.user.save();
        res.send('You have logged out of all accounts.');
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/users/me',auth,async (req,res) => {
    res.send(req.user);
})

// router.get('/users/:id',async (req,res)=>{
//     const _id = req.params.id;
//     try {
//         const loser = await User.findById(_id);
//         if(!loser){
//             return res.status(404).send();
//         }
//         res.status(200).send(loser);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// })

router.patch('/users/me',auth,async(req,res) => {
    const updates = Object.keys(req.body); //name
    const allowedUpdate = ['name','age','email','password'];
    const isValidOperation = updates.every((update) => {
        
        return allowedUpdate.includes(update);
    })
    if (!isValidOperation) {
        return res.status(400).send();
    }
    try {
       updates.forEach((update) => {req.user[update] = req.body[update];})
       await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
           return cb(new Error('Only .jpg,.jpeg or .png is allowed'));
        }
        cb(undefined, true);
    }
    
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=> {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    console.log(buffer);
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar',async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error('idk why this isnt working');
        }

        res.set('Content-Type','image/png');
        res.send(user.avatar)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

module.exports = router;