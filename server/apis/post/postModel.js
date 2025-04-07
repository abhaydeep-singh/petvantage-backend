const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{type:String},
    image:{type:String},
    addedBy:{type:String},
    likes:{type:String},
    totalLikes:{type:Number}
});

module.exports = new mongoose.model("post",postSchema);