const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:[true, 'Please enter the username']
        },
        email:{
            type:String,
            required:[true, 'Please enter the email']
        },
        password:{
            type:String,
            required:[true, 'Please enter the password']
        },
        userimg:{
            type:String,
            default:"https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png"
        },
        usercoverimg:{
            type:String,
            default:"https://d2x3xhvgiqkx42.cloudfront.net/43cf6303-25b8-4c1e-9942-cb14f8fe611e/caa7233a-a6bf-4482-93a9-62ae52b515cc/2020/06/18/61cf6bfa-3e00-4ebf-ab37-0712958ec0ef/b4ffc494-e590-4d31-9b39-5aa9b3d98312.png"
        },
        userbio:{
            type:String,
            default:"Hello! I'm new Tweeter"
        }
    }
)

module.exports = mongoose.model("User", userSchema);