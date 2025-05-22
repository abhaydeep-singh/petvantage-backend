const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    contact:{type:Number},
    image:{type:String},
    // profile:{type:String},
    address:{type:String},
    regNo:{type:String},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("ngo",ngoSchema);