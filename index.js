const express = require('express');
const mongoose = require('mongoose');const dotenv = require('dotenv');const morgan = require('morgan');
const helmet = require('helmet');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute =  require('./routes/posts');

const app = express();

dotenv.config();

  const connection = mongoose.connect(
    process.env.MONGO_URL,
    
  )

  if(!connection)
  {
    console.error('error=>'+connection);
  }
  else{
    console.log('connect to mongoDB');
  }
 
//   middlewares
    app.use(express.json());
    app.use(helmet());
    app.use(morgan("common"));

//   restAPI
    app.use("/api/auth", authRoute);
    app.use("/api/users",userRoute);
    app.use("/api/posts", postRoute);
    


    
  

app.listen(8800,()=>{
    console.log("Backend server is running...");
})