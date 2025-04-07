const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    contact:{type:Number},
    image:{type:String},
    profile:{type:String},
    address:{type:String},
    regNo:{type:String}
});

module.exports = new mongoose.model("ngo",ngoSchema);