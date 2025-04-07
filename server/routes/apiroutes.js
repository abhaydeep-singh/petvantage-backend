const routes = require("express").Router();
const petseekerController = require("../apis/petseeker/petseekerController.js");
const userController = require("../apis/users/userController.js");
const ngoController = require("../apis/ngo/ngoController.js");
const petController = require("../apis/pet/petController.js");
const categoryController = require("../apis/category/categoryController.js");
const breedController = require("../apis/breed/breedController.js");

// User Routes (LOGIN) common for all
routes.post("/user/login",userController.login);

// NGO and Petseeker Register
routes.post("/ngo/register",ngoController.register);
routes.post("/petseeker/register",petseekerController.register);

routes.use(require("../middleware/middleware.js"));



// Pet Routes
routes.post("/pet/add",petController.addPet);
routes.delete("/pet/delete",petController.deletePet);
routes.get("/pet/getall",petController.getAllPet);
// Categories
routes.post("/category/add",categoryController.addCat);
routes.delete("/category/delete",categoryController.deleteCat);

// Breeds
routes.post("/breed/add",breedController.addBreed);
routes.delete("/breed/delete",breedController.deleteBreed);


module.exports = routes;