const routes = require("express").Router();
const petseekerController = require("../apis/petseeker/petseekerController.js");
const userController = require("../apis/users/userController.js");
const ngoController = require("../apis/ngo/ngoController.js");
const petController = require("../apis/pet/petController.js");
const categoryController = require("../apis/category/categoryController.js");
const breedController = require("../apis/breed/breedController.js");

const multer = require("multer");

// User Routes (LOGIN) common for all
routes.post("/user/login",userController.login);

// NGO and Petseeker Register
routes.post("/ngo/register",ngoController.register);
routes.post("/petseeker/register",petseekerController.register);

routes.use(require("../middleware/middleware.js"));

// NGO routes
routes.post("/ngo/mypets",ngoController.ngoPets); //TODO: Not tested Yet


const petstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './server/public/pet')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
  })
  
  const petupload = multer({ storage: petstorage })

// Pet Routes
routes.post("/pet/add",petupload.single("image"),petController.addPet);
routes.delete("/pet/delete",petController.deletePet);
routes.get("/pet/getall",petController.getAllPet); //Get
routes.post("/pet/getbycat",petController.getByCategory);
routes.post("/pet/getbybreed",petController.getByBreed);
// Categories
routes.post("/category/add",categoryController.addCat);
routes.delete("/category/delete",categoryController.deleteCat);

// Breeds
routes.post("/breed/add",breedController.addBreed);
routes.delete("/breed/delete",breedController.deleteBreed);


module.exports = routes;