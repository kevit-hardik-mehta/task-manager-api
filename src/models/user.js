const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Task = require('./task');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Enter proper email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (value.includes('password')) {
                throw new Error('Password cannot contain password');
            }
            if (value.length<6) {
                throw new Error('Password length has to be 6 or more than 6');
            }
        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},
{
    timestamps: true
}
)

userSchema.methods.toJSON = function ()  {

    const user = this;

    userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;

}

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    console.log(process.env.JWT_TOKEN)
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN);
    
    user.tokens = user.tokens.concat({token: token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Password doesnt match');
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User
