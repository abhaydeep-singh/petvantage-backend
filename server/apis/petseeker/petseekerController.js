const petseekerModel = require("./petseekerModel.js");
const userModel = require("../users/userModel.js");
const bcrypt = require("bcrypt");

const register = (req, res) => {
  // console.log(req.body)
  let errMsgs = [];
  if(!req.body.name) {
    errMsgs.push("name is required!!");
  }
  if(!req.body.email) {
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

  if (errMsgs.length > 0) {
    res.send({
      status: 422,
      success: false,
      message: errMsgs,
    });
  } else {
    // Check if email exist or not
    userModel
      .findOne({ email: req.body.email }) // Always return something even if email is not there (it returns NULL)
      .then((data) => {
        if (data == null) {
          let userObj = new userModel();
          userObj.name = req.body.name;
          userObj.email = req.body.email;
          userObj.password = bcrypt.hashSync(req.body.password, 10);
          userObj.userType = 3;
          userObj
            .save()
            // saving in both models in one request
            .then((userData) => {
              let petseekerObj = new petseekerModel();
              petseekerObj.userID = userData._id;
              petseekerObj.name = req.body.name;
              petseekerObj.email = req.body.email;
              petseekerObj.image = req.body.image;
              petseekerObj.contact = req.body.contact;
              petseekerObj.address = req.body.address;
              petseekerObj
                .save()
                .then((petseekerData) => {
                  
                  res.send({
                    status: 200,
                    success: true,
                    message: "PetSeeker Registered successfully!",
                    data: petseekerData,
                  });
                })
                .catch((err) => {
                  res.send({
                    status: 500,
                    success: false,
                    message: "Internel server error",
                    errmessages: err,
                  });
                });
            })
            .catch((err) => {
              res.send({
                status: 500,
                success: false,
                message: "Internel server error",
                errmessages: err,
              });
            });
        } else {
          //email already exists
          res.send({
            status: 422,
            success: false,
            message: "Email already exists",
          });
        }
      })
      .catch((err) => {
        res.send({
          status: 500,
          success: false,
          message: "Internel server error",
          errmessages: err,
        });
      });
  }
};

module.exports = {register}
