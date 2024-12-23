const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const { error } = require('console')
const userRoute = require('./routes/formUser')
const PORT = process.env.PORT || 3000

dotenv.config();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/user', userRoute);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('MongoDB connected')
    }).catch((error)=>{
        console.log(error)
    });
})