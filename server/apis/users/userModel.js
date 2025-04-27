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
    image:{
        type:String
    },
    username:{
        type:String
    },
    // petSeekerID:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"petseekers"
    // },
    // ngoID:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"ngo"
    // },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = new mongoose.model("user",userSchema);