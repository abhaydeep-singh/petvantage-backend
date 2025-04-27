const userModel = require("./userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
let secretkey = "123#@"

const login =(req,res) => {
    // console.log(req.body.name)
  let errMsgs = [];
    // let email = req.body.email;
    
    if(!req.body.email) {
    errMsgs.push("email is required!!");
  }
  if(!req.body.password) {
    errMsgs.push("password is required!!");
  }
  if(errMsgs.length > 0) {
    res.send({
      status: 422,
      success: false,
      message: errMsgs,
    });
  }
   else {
    userModel.findOne({email:req.body.email})
    .then((data)=>{
        if (data == null) {
            // User do not exist
            res.send({
                status: 404,
                success: false,
                message: "User not found",
              });
        } else {
            // compare password
            bcrypt.compare(req.body.password,data.password,(err,isMatch)=>{
                if (!isMatch) {
                      res.send({
                        status: 422,
                        success: false,
                        message: "Login failed! Password is Wrong",
                      })
                } else {
                  let payload = {
                    _id:data._id,
                    name:data.name,
                    userType:data.userType,
                    email:data.email
                    }
                let token = jwt.sign(payload,secretkey)
                    res.send({
                        status: 200,
                        success: true,
                        message: "Login Succesfull",
                        data:data,
                        token:token
                      })
                }
            })
        }
    })
    .catch((err)=>{
        res.send({
            status:500,
            success:false,
            message:"Internal Server Error",
            error:err
        })
    })
  }
};

const changePassword = async (req, res) => {
  const { userID, oldPassword, newPassword, confirmPassword } = req.body;
  let errMsgs = [];

  if (!userID) errMsgs.push("userID is required!!");
  if (!oldPassword) errMsgs.push("oldPassword is required!!");
  if (!newPassword) errMsgs.push("newPassword is required!!");
  if (!confirmPassword) errMsgs.push("confirmPassword is required!!");

  if (errMsgs.length > 0) {
    return res.status(422).send({
      status: 422,
      success: false,
      message: errMsgs,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(422).send({
      status: 422,
      success: false,
      message: "New and confirm passwords don't match",
    });
  }

  try {
    const userData = await userModel.findOne({ _id: userID });
    if (!userData) {
      return res.status(404).send({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
      return res.status(422).send({
        status: 422,
        success: false,
        message: "Old password is incorrect",
      });
    }

    userData.password = await bcrypt.hashSync(newPassword, 10);
    const savedData = await userData.save();

    return res.status(200).send({
      status: 200,
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


module.exports = {login, changePassword};