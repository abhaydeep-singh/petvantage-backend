const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name:{type:String}, // added by me
    breed:{type:String},
    category:{type:String},
    addedByID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    image:{type:String},
    desc:{type:String},
    alreadyRequested:{type:Boolean,default:false} 

});

module.exports = new mongoose.model("pet",petSchema);