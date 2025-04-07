const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/petvantageTest")
.then(()=>{
    console.log("Database Connected Succesfuly!");
    
})

.catch((error)=>{
    console.log("Database connection failed! Error:",error)
})