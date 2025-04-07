const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name:{type:String}, // added by me
    breed:{type:String},
    category:{type:String},
    addedByID:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    image:{type:String},
    desc:{type:String}

});

module.exports = new mongoose.model("pet",petSchema);