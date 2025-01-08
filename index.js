const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const { error } = require('console')
const userRoute = require('./routes/formUser')
const folderRoute = require('./routes/folder');
const formRoute = require('./routes/forms')

dotenv.config();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/user', userRoute);
app.use('/api/folder', folderRoute);
app.use('/api/form', formRoute);

const PORT = process.env.PORT || 4000 

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('Connected to MongoDB')
    }).catch((error)=>{
        console.log(`Error connecting to MongoDB ${error}`);
    });
})