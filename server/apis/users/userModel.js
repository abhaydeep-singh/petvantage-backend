const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:""
    },
    userType:{
        type:Number, //[1 2 3] 1-admin, 2-ngo, 3-petseeker 
        default:3
    },
    petSeekerID:{
        // ref to petseeker 
    },
    ngoID:{
        // ref to ngomodal
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = new mongoose.model("users",userSchema);