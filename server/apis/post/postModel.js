const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content:{type:String},
    image:{type:String},
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    like:{type:Boolean,default:false}, //FIXME:
    commentIDs:[{ // IMPORTANT Array of Object ID, so that it can store multiple comments!
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }], 
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
});

module.exports = new mongoose.model("post",postSchema);