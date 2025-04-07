const mongoose = require("mongoose");

// Schema according to O7's keys
const adoptionSchema = new mongoose.Schema({
    addedByID:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    petID:{
        type:mongoose.Types.ObjectId,
        ref:"pets"
    },
    idProof:{type:String},
    incomeCertificate:{type:String},
    bankStatement:{type:String},
    address:{type:String}
});

module.exports = mongoose.model("adoption",adoptionSchema);