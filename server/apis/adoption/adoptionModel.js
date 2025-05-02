const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
    petID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"pet" //use same name as u mentioned in model do    i=not use 's' if not mentioned specifically
    },
    reqUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    desc:{
        type:String
    },
    adoptionStatus:{
        type:String,
        default:"pending" //aprooved, rejected
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("adoption",adoptionSchema);