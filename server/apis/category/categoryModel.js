const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("categories",categorySchema);