const express = require('express');
const router = new express.Router;
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { findById } = require('../models/user');
const User = require('../models/user');

router.get('/tasks',auth,async (req,res) => {
    try {
        const id = req.user._id;
        const match = {};
        const sort = {};

        if (req.query.sort) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
            console.log(match.completed)
        }
        // const tasks = await Task.find({owner: req.user._id});
        const user = await User.findById(id).populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).exec()
        res.send(user.tasks);    
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task)    
    } catch (error) {
        res.send(error.message);
    }
})
router.post('/tasks',auth,async (req,res)=>{
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        console.log(task)
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.patch('/tasks/:id',auth,async(req,res) => {
    const updates = Object.keys(req.body);
    console.log(updates)
    const allowedUpdate = ['description','completed'];
    const isValidOperation = updates.every((update) => {
      return  allowedUpdate.includes(update);
    })
    console.log(isValidOperation)
    if (!isValidOperation) {
        return res.status(400).send();
    }
    try {
        const task = await task.findOne({_id: req.params.id,owner: req.user._id});
        await task.save();
        if (!task) {
            res.status(404).send();
        }
        updates.forEach(element => {
            task[element] = req.body[element]; 
        });

        res.send(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
router.delete('/tasks/:id',auth, async(req,res)=>{
    try {
        const task = await Task.findOneAndDelete({owner: req.user._id, _id: req.params._id});

        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;