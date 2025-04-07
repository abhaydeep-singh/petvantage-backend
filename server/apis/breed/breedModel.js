const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
    name:{type:String},
    categoryID:{
        type:mongoose.Types.ObjectId,
        ref:"categories"
    },
    image:{type:String},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}

});

module.exports = new mongoose.model("breed",breedSchema);