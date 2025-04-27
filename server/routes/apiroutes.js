const routes = require("express").Router();
const petseekerController = require("../apis/petseeker/petseekerController.js");
const userController = require("../apis/users/userController.js");
const ngoController = require("../apis/ngo/ngoController.js");
const petController = require("../apis/pet/petController.js");
const adoptionController = require("../apis/adoption/adoptionController.js");
const dashboardController = require("../apis/dashboard/dashboardController.js");
const postController = require("../apis/post/postController.js");
// const createMulter = require("../middleware/multer.js");



// const multer = require("multer");

// Multer
// const petstorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './server/public/pet')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
//   }
// })

// const petupload = multer({ storage: petstorage })




// User Routes (LOGIN) common for all

const multer = require("multer")
const memoryStorage = multer.memoryStorage()
const upload = multer({memoryStorage})

routes.post("/user/login",userController.login);
routes.post("/user/changepass",userController.changePassword);


// NGO and Petseeker Register
// const ngoupload = createMulter("ngo"); // saves in /public/ngo
routes.post("/ngo/register",upload.single("image"),ngoController.register);
routes.post("/petseeker/register",upload.single("image"),petseekerController.register);



routes.use(require("../middleware/middleware.js"));



// NGO routes
routes.post("/ngo/mypets",ngoController.ngoPets);
routes.post("/ngo/getall",ngoController.getAllNgo);
routes.post("/ngo/getsingle",ngoController.getSingleNgo);
routes.post("/ngo/update",ngoController.updateProfile);
routes.post("/ngo/pagination",ngoController.getPagination); 


// PetSeeker Routes
routes.post("/petseeker/getsingle",petseekerController.getSinglePetSeeker); 
routes.post("/petseeker/get",petseekerController.getAllPetSeeker); 
routes.post("/petseeker/update",petseekerController.updateProfile); //TODO: Not tested Yet
routes.post("/petseeker/pagination",petseekerController.getPagination);



// Pet Routes
// const petupload = createMulter("pet"); // saves in /public/pet
routes.post("/pet/add",upload.single("image"),petController.addPet);
routes.post("/pet/delete",petController.deletePet); //soft delete
routes.post("/pet/update",petController.updatePet); //TODO: Not tested Yet
routes.post("/pet/getsingle",petController.getSinglePet);
routes.post("/pet/getall",petController.getAllPet); //Get 
routes.post("/pet/getbycat",petController.getByCategory);
routes.post("/pet/getbybreed",petController.getByBreed);
routes.post("/pet/pagination",petController.getPagination);
    
// Adoption routes
routes.post("/request/add",adoptionController.makeReq); 
routes.post("/request/update",adoptionController.updateReq); //TODO: Not Tested yet
routes.post("/request/getall",adoptionController.getAll);
routes.post("/request/delete",adoptionController.deleteReq);  //TODO: Not Tested yet

// Dashboard
routes.post("/dashboard/getCount",dashboardController.getCount);

// Post Routes
routes.post("/post/add",upload.single("image"),postController.addPost);
routes.post("/post/update",postController.updatePost); 
routes.post("/post/delete",postController.deletePost); 
routes.post("/post/addcomment",postController.addComment); 
routes.post("/post/deletecomment",postController.deleteComment); 
routes.post("/post/getsingle",postController.getSingle); 
routes.post("/post/get",postController.getAllPosts);
routes.post("/post/pagination",postController.getPagination);





module.exports = routes;