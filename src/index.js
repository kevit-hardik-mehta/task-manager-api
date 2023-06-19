const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const User = require('./models/user')

const app = express();
const port = process.env.PORT;



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log("Server is up and running")
})

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,cb){

        if (!file.originalname.match(/\.(csv)$/)) {
            return  cb(new Error('File must be a word doc'))
        }

        cb(undefined, true)

    }
})

app.post('/uploads',upload.single('upload'),(req,res) => {

    res.status(200).send();

})


const main = async () => {
    // const user = await User.findById('64896f6ececa1a4c08e3b371');
    // await user.populate('tasks').exec();

    // const user = await User.findById('64896f6ececa1a4c08e3b371');
    // await user.populate('tasks').exec();
    // console.log(user.tasks);
}

main();