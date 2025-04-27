const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    // postID:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"post"
    // },
    comment:{
        type:String
    },
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("comment",commentSchema);