const express = require("express");
const app = express();
const port = 5000;
const db = require("./server/config/db.js");
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));

// This line makes the folder publicaly accesible, it serves files as static assets[can access directly by URL now]
// dirname is absolute path
app.use(express.static(__dirname+("/server/public/")));

const routes = require("./server/routes/apiroutes.js");

const seeder = require("./server/config/seeder.js");
seeder.seederReg();


app.use("/api",routes);



app.listen(port,()=>{
    console.log("Server connected to port: ",port);
    
})