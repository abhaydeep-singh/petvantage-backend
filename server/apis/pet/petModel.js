const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name:{type:String}, // added by me
    breedID:{
        type:mongoose.Types.ObjectId,
        ref:"breeds"
    },
    addedByID:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    image:{type:String},
    desc:{type:String}

});

module.exports = new mongoose.model("pet",petSchema);