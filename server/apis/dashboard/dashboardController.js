const petModel = require("../pet/petModel.js");
const ngoModel = require("../ngo/ngoModel.js");
const userModel = require("../users/userModel.js");
const petseekerModel = require("../petseeker/petseekerModel.js");

const getCount = async(req,res)=>{
    // let ngos = 0;
    // let petseekers = 0;
    // let pets = 0;
    // let totalUsers = 0;

    let ngos = await ngoModel.countDocuments();
    // let ngos = await ngoModel.countDocuments({status:"true"});
    // let ngos = await ngoModel.countDocuments();
    
    let pets = await petModel.countDocuments();
    let petseekers = await petseekerModel.countDocuments();
    let totalUsers = await userModel.countDocuments();

    res.send({
        status:200,
        success:true,
        message:"Dashboard API called",
        total_users: totalUsers,
        total_ngos: ngos,
        total_pets: pets,
        total_petseekers: petseekers
    })
};

module.exports = {getCount};