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
app.use(cors({
    credentials:true,
    origin:'http://192.168.0.109:5173'
}));

app.use('/api/tweet',require('./Routes/tweetRoutes'))
app.use('/api/user', require('./Routes/userRoutes'))

app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
})