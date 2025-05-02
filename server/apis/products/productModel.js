const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:{
        type:String
    },
    desc:{
        type:String
    },
    image:{
        type:String
    },
    cost:{
        type:Number
    },
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("product",productSchema);