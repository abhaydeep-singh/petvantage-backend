const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    addedByID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    commentIDs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("blog",blogSchema);