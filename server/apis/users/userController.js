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


module.exports = {login};