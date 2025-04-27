const petseekerModel = require("./petseekerModel.js");
const userModel = require("../users/userModel.js");
const bcrypt = require("bcrypt");
const { uploadImg } = require("../../utils/cloudinary.js");
const register = async (req, res) => {
  let errMsgs = [];
  if (!req.body.name) {
    errMsgs.push("name is required!!");
  }
  if (!req.body.username) {
    errMsgs.push("username is required!!");
  }
  if (!req.body.email) {
    errMsgs.push("email is required!!");
  }
  if (!req.body.password) {
    errMsgs.push("password is required!!");
  }
  if (!req.file) {
    errMsgs.push("IMAGE is required!!");
  }
  if (!req.body.contact) {
    errMsgs.push("contact is required!!");
  }
  if (!req.body.address) {
    errMsgs.push("address is required!!");
  }

  if (errMsgs.length > 0) {
    res.send({
      status: 422,
      success: false,
      message: errMsgs,
    });
  } else {
    try {
      const data = await userModel.findOne({ email: req.body.email });
      if (data == null) {
        let userObj = new userModel();
        userObj.name = req.body.name;
        userObj.user = req.body.username;
        userObj.email = req.body.email;
        userObj.password = bcrypt.hashSync(req.body.password, 10);
        userObj.userType = 3;
        if (req.file) {
          try {
            let url = await uploadImg(req.file.buffer);
            userObj.image = url;
          } catch (err) {
            console.log(err);
  
            res.send({
              status: 400,
              success: false,
              message: "cloudnairy error!!",
            });
          }
        }

        const userData = await userObj.save();

        let petseekerObj = new petseekerModel();
        petseekerObj.userID = userData._id;
        petseekerObj.name = req.body.name;
        petseekerObj.email = req.body.email;
        // petseekerObj.image = req.body.image;
        // FIXME: handle image here
        petseekerObj.contact = req.body.contact;
        petseekerObj.address = req.body.address;

        const petseekerData = await petseekerObj.save();

        res.send({
          status: 200,
          success: true,
          message: "PetSeeker Registered successfully!",
          data: petseekerData,
        });
      } else {
        res.send({
          status: 422,
          success: false,
          message: "Email already exists",
        });
      }
    } catch (err) {
      res.send({
        status: 500,
        success: false,
        message: "Internel server error",
        errmessages: err,
      });
    }
  }
};


const updateProfile = async(req,res) => {
  const {_id, name, email, contact, address} = req.body;
  // const {image} = req.file; //canot destruct
  
  if(!_id){
    return res.send({
      status: 422,
      success: false,
      message: "ID is required",
    });
  }
  try {
    let savedData = await petseekerModel.findOne({_id:_id}).populate("userID")
    // res.send(savedData.userID._id)
    let savedUserData = await userModel.findOne({_id:savedData.userID._id})
    if(!savedData || !savedUserData){
      return res.send({
        status: 422,
        success: false,
        message: "Data Not found for given user",
      })
    }
    if(name){ savedUserData.name = name }
    if(email){ savedUserData.email = email }
    if(req.file){
      try {
        let url = await uploadImg(req.file.buffer);
        savedData.image = url;
      } catch (err) {
        console.log(err);

        return res.send({
          status: 400,
          success: false,
          message: "cloudnairy error!!",
        });
      }
    }
    if(contact){ savedData.contact = contact }
    if(address){ savedData.address = address }
    if(regNo){ savedData.regNo = regNo }

    let updatedData = await savedData.save();
    let updatedUserData = await savedUserData.save();
    if(!updatedData || !updatedUserData){
      return res.send({
        status: 422,
        success: false,
        message: "Something wrong happend while updating Profile",
      })
    }

    return res.send({
      status: 200,
      success: true,
      message: "Profile Updated Succesfully",
      data:updatedData //FIXME: it is sending old (not updated) populated data
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      
    })
  }
};

const getSinglePetSeeker = async(req,res) =>{
  try {
    if(!req.body._id){
      return res.send({
        status:422,
        success:false,
        message:"ID is required"
      })
    }
    const data = await petseekerModel.findOne({_id:req.body._id})
    if(!data){
      return res.send({
        status:422,
        success:false,
        message:"Something wrong happened while fetching data"
      })
    }
    return res.send({
      status:200,
      success:true,
      message:"Data Fecthed succesfully",
      data:data
    })
  
  } catch (err) {
    return res.send({
      status:422,
      success:false,
      message:"Internal Server Error",
      error:err
    })
  }
};

const getAllPetSeeker = async(req,res) => {
  try {
      const data = await petseekerModel.find();
      if(!data){
        return res.send({
          status:422,
          success:false,
          message:"Data not found"
        })
      }
      res.send({
        status:200,
        success:true,
        message:"Data fetched Succesfully",
        data:data
      })

  } catch (error) {
    
    res.send({
    status:422,
    success:false,
    message:"Internel Server Error",
    error:err
  })
}
};

const getPagination = async (req, res) => {
  let errs = [];

  try {
    const { pageNo, limit } = req.body;
    if (!pageNo) {
      errs.push("Page no is required!")
    }
    if (!limit) {
      errs.push("limit is required!")
    }
    if (errs.length > 0) {
      return res.send({
        status: 422,
        success: false,
        message: errs
      })
    }
    let skip = 0;
    if (pageNo > 1) {
      skip = (pageNo - 1) * limit
    }

    let data = await petseekerModel.find().skip(skip).limit(limit);
    if (!data) {
      return res.send({
        status: 422,
        success: false,
        message: "Something went wrong while fetching pagination data",
      })
    }
    res.send({
      status: 200,
      success: true,
      message: "Data loaded succesfully",
      data: data
    })
  }
  catch (error) {
    res.send({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error
    })
  }
};

module.exports = {register, getSinglePetSeeker, getAllPetSeeker, updateProfile, getPagination}
