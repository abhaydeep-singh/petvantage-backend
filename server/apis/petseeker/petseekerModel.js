const mongoose = require("mongoose");

const petseekerSchema = new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    image:{type:String,default:""},
    contact:{type:Number},
    address:{type:String,default:""},
    userID:{type:mongoose.Schema.Types.ObjectId , ref:"users" },
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("petseekers",petseekerSchema);



