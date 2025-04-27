const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/petvantageTest")
mongoose.connect("mongodb+srv://abhaysinghdeep7890:HrXBVZxPu3NPiO0p@cluster0.li8zajr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Database Connected Succesfuly!");
    
})

.catch((error)=>{
    console.log("Database connection failed! Error:",error)
})