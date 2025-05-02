const ngoModel = require("./ngoModel.js");
const userModel = require("../users/userModel.js");
const bcrypt = require("bcrypt");
const petModel = require("../pet/petModel.js");
const { uploadImg } = require("../../utils/cloudinary.js");
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
    if (!req.file) {
      errMsgs.push("IMAGE is required!!");
    }
    if (!req.body.contact) {
      errMsgs.push("contact is required!!");
    }
    if (!req.body.username) {
      errMsgs.push("username is required!!");
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
        return res.send({
          //Return is required to quit function
          status: 422,
          success: false,
          message: "Email already exists",
        });
      }

      const userObj = userModel()
      userObj.name = req.body.name
      userObj.email = req.body.email
      userObj.password = bcrypt.hashSync(req.body.password, 10)
      userObj.userType = 2
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
      const savedUser = await userObj.save();
      // Handle "User Not Saved" if u want

      const ngoObj = ngoModel();
      ngoObj.userID = savedUser._id;
      ngoObj.contact = req.body.contact;
      // image: "ngo/" + req.file.filename,
      if (req.file) {
        try {
          let url = await uploadImg(req.file.buffer);
          ngoObj.image = url;
        } catch (err) {
          console.log(err);

          res.send({
            status: 400,
            success: false,
            message: "cloudnairy error!!",
          });
        }
      }

      ngoObj.username = req.body.username;
      ngoObj.regNo = req.body.regNo;
      const savedNgo = await ngoObj.save();
      // Handle "NGO Not Saved" if u want

      if (savedNgo && userObj) {
        res.send({
          status: 200,
          success: true,
          message: "NGO is registered Succesfuly",
          data: savedNgo,
        });
      }
    }
  } catch (error) {
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const ngoPets = async (req, res) => {
  const _id = req.decoded._id;
  if (!_id) {
    return res.send({
      status: 422,
      success: false,
      message: "ID is required",
    });
  }
  const pets = await petModel.find({ addedByID: _id }); // Here _id is loggedin user (NGO) 's ID
  res.send({
    status: 200,
    success: true,
    messgae: "Pets for this id fetched succesfully",
    data: pets,
  });
};

const updateProfile = async(req,res) => {
  const {_id, name, email, contact, username, regNo} = req.body;
  // const {image} = req.file; //canot destruct
  
  if(!_id){
    return res.send({
      status: 422,
      success: false,
      message: "ID is required",
    });
  }
  try {
    let savedData = await ngoModel.findOne({_id:_id}).populate("userID")
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
    if(username){ savedData.username = username }
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


const getAllNgo = async (req, res) => {
  try {
    const ngos = await ngoModel.find().populate("userID");
    if (!ngos) {
      return res.send({
        status: 422,
        success: false,
        message: "NGOs not found",
      });
    }
    res.send({
      status: 200,
      success: true,
      message: "NGOs fetched Succesfully",
      data: ngos,
    });
  } catch (error) {
    res.send({
      status: 422,
      success: false,
      message: "Internel Server error",
      error: error.message,
    });
  }
};

const getSingleNgo = async(req,res) =>{
try {
  if(!req.body._id){
    return res.send({
      status:422,
      success:false,
      message:"ID is required"
    })
  }
  const data = await ngoModel.findOne({_id:req.body._id})
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

    let data = await ngoModel.find().skip(skip).limit(limit);
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

module.exports = { register, ngoPets, getAllNgo, getSingleNgo ,updateProfile, getPagination };
