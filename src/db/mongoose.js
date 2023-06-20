const mongoose = require('mongoose');
const validator = require('validator')

mongoose.connect(process.env.CONNECTION_URL)

// const User = mongoose.model('User',
// {
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Enter proper email address');
//             }
//         }
//     },

//     password: {

//         type: String,
//         required: true,
//         trim: true,
//         validate(value){
//             if (value.includes('password')) {
//                 throw new Error('Password cannot contain password');
//             }
//             if (value.length<6) {
//                 throw new Error('Password length has to be 6 or more than 6');
//             }
//         }

//     },

//     age: {
//         type: Number
        
//     }
// })

// const me = new User({
//     name: 'Hardik',
//     age: '21',
//     email: 'rocky@kgf.com',
//     password: '   test1235'
// })

// me.save().then(()=>{
//     console.log(me);
// })
// .catch((error) => {
    
//     console.log(error)
    
// })

// const Task = mongoose.model('Task',{

//     descriptions: {

//         type: String,
//         required: true,
//         trim: true
//     }, 

//     completed: {
//          type: Boolean,
//          default: false 
//     }
// })

// const random = new Task({
//     descriptions: "       test",
// })

// random.save()
// .then(() => {
//     console.log(random);
// })
// .catch((error) => {
//     console.log(error);
// })