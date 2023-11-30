const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = async ()=>{
    try {
        console.log(process.env.CONNECTION_STRING);
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DB Connection is Success",
        connect.connection.host,
        connect.connection.name)
    } catch (err) {
        console.log('DB connection failed !',err)
    }
}

module.exports = connectDB;