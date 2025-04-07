const jwt = require("jsonwebtoken");
let secretkey = "123#@"
module.exports = (req,res,next)=>{
    let token = req.headers["authorization"];
    jwt.verify(token,secretkey,function(err,data){
        if(err != null){
            res.json({
                status:422,
                success:false,
                message:"Unauthorized Access"
            })
        }
        else{
            req.decoded = data;
            next();
        }
    })
}