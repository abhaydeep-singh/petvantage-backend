const userModel = require("../apis/users/userModel.js");
const bcrypt = require("bcrypt");
const seederReg = ()=>{
    userModel.findOne({email:"admin@gmail.com"})
    .then((data)=>{
        if (data == null) { 
            let userObj = new userModel();
            userObj.email = "admin@gmail.com";
            userObj.password = bcrypt.hashSync("123",10)
            userObj.save()
            .then((data)=>{
                console.log("Admin added Succesfully");
            })
            .catch((err)=>{
                console.log("Something wrong happeed while adding admin")
            })

        }
        else{
            console.log("Admin already exists!");
        }
    })
};

module.exports = {seederReg};