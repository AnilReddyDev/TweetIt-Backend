const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/DBconfig')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');

connectDB();

app.use(express.json());
app.use(cookieParser())

// CORS middleware configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tweetin.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
  
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

// app.use(cors({
//     credentials:true,
//     origin:'http://192.168.0.109:5173'
// }));

app.use('/api/tweet',require('./Routes/tweetRoutes'))
app.use('/api/user', require('./Routes/userRoutes'))

app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
})