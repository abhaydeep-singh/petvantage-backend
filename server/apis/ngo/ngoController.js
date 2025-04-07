const ngoModel = require("./ngoModel.js");
const userModel = require("../users/userModel.js");
const bcrypt = require("bcrypt");
const petModel = require("../pet/petModel.js");


const register = async (req, res) => {
  try {
    // Null Validation
    let errMsgs = [];
    if (!req.body.name) {
      errMsgs.push("name is required!!");
    }
    if (!req.body.email) {
      errMsgs.push("email is required!!");
    }
    if (!req.body.password) {
      errMsgs.push("password is required!!");
    }
    if (!req.body.image) {
      errMsgs.push("IMAGE is required!!");
    }
    if (!req.body.contact) {
      errMsgs.push("contact is required!!");
    }
    if (!req.body.address) {
      errMsgs.push("address is required!!");
    }
    if (!req.body.regNo) {
      errMsgs.push("Registration No is required!!");
    }

    if (errMsgs.length > 0) {
      return res.send({
        status: 422,
        success: false,
        message: errMsgs, 
      });
    } else {
      // check if user exist or not
      const existingUser = await userModel.findOne({ email: req.body.email });

      // Verified for Null
      if (existingUser) {
        return res.send({ //Return is required to quit function
          status: 422,
          success: false,
          message: "Email already exists",
        });
      }

      const userObj = userModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        userType: 2,
        // petSeekerID:req.body.pet
        // ngoID:req.body.ngoID, //FIXME: check useModel and fix it and save it later in api after saving NGO
      });
      const savedUser = await userObj.save();
      // Handle "User Not Saved" if u want

      const ngoObj = ngoModel({
        userID: savedUser._id,
        contact: req.body.contact,
        image: req.body.image,
        // profile:req.body.profile, //FIXME: Get 'profile' in body and uncomment this
        address: req.body.address,
        regNo: req.body.regNo,
      });
      const savedNgo = await ngoObj.save();
      // Handle "NGO Not Saved" if u want

      if(savedNgo && userObj){
        res.send({
            status:200,
            success:true,
            message:"NGO is registered Succesfuly",
            data:savedNgo

        })
      }
    }
  } catch (error) {
    res.send({
        status:500,
        success:false,
        message:"Internal Server Error",
        error:error
    })
  }
};


const ngoPets = async(req,res) =>{
  const {_id} = req.body;
  if(!_id){
   return res.send({
      status:422,
      success:false,
      message:"ID is required"
    })
  }
  const pets = await petModel.find({addedByID:_id}) // Here _id is loggedin user (NGO) 's ID
  res.send({
    status:200,
    success:true,
    messgae:"Pets for this id fetched succesfully",
    data:pets
  })

};
module.exports = { register, ngoPets };
