const petModel = require("./petModel.js");
const breedModel = require("../breed/breedModel.js");
const categoryModel = require("../category/categoryModel.js");

const addPet = async (req, res) => {
  try {
    let errors = [];
    if (!req.body.name) errors.push("Name is required");
    if (!req.body.breed) errors.push("Breed is required");
    if (!req.body.category) errors.push("Category is required");
    if (!req.body.addedByID) errors.push("'Added By' ID is required");
    if (!req.file) errors.push("Image is required");
    if (!req.body.desc) errors.push("Description is required");

    if (errors.length > 0) {
      res.send({
        status:422,
        success:false,
        message:"Incomplete data",
        errors:errors
      })
    }

    // Create a new pet entry
    const petObj = new petModel({
        name:req.body.name,
        breed:req.body.breed, 
        category:req.body.category,
        addedByID:req.body.addedByID, 
        image: "pet/" + req.file.filename,
        desc:req.body.desc
    });
    const petData = await petObj.save();

    if(!petData){
        return res.send({
        status:422,
        success:false,
        message:"Something unexpected happened while saving pet data",
      })}

    res.send({
      status:200,
      success:true,
      message:"Pet Data Added Sucesfully",
      data:petData
    })





    // Create breed and category data!! TODO:

  } catch(err) {
    {
          res.send({
          status:422,
          success:false,
          message:"Internal Server Error",
          error:err
        })}
  }
};

const deletePet = async(req,res) => {

  try {
    const {id} = req.body;
    if(!id){
      return res.send({
        status:422,
        success:false,
        message:"ID is required"
      })
    }

    const data = await petModel.findOne({ _id: id });
    if(!data){
      return res.send({
        status:422,
        success:false,
        message:"Pet not found"
      })
    }

    data.status = false;

    const updatedData = await data.save();
    if (updatedData) {
      return res.send({
        status:200,
        success:true,
        message:"Pet Deleted Softly",
        data:updatedData
      })
    }

  } catch(err) {
    
          res.send({
          status:422,
          success:false,
          message:"Something unexpected happened while saving pet data",
          error:err
        })
  }
};



// Generic Apis
const getAllPet = async(req,res) => {
  try {
      const pets = await petModel.find();
      if(!pets){
        return res.send({
          status:422,
          success:false,
          message:"Pets not found"
        })
      }
      res.send({
        status:200,
        success:true,
        message:"Pets fetched Succesfully",
        data:pets
      })

  } catch (error) {
    
    res.send({
    status:422,
    success:false,
    message:"Something unexpected happened while fetchinG pets",
    error:err
  })
}
};

const getByCategory = async(req,res) => {
  try {
      const pets = await petModel.find({category:req.body.category});
      if(!pets){
        return res.send({
          status:422,
          success:false,
          message:"Pets not found"
        })
      }
      res.send({
        status:200,
        success:true,
        message:"Pets fetched Succesfully",
        data:pets
      })

  } catch (error) {
    
    res.send({
    status:422,
    success:false,
    message:"Something unexpected happened while fetchinG pets",
    error:err
  })
}
};

const getByBreed = async(req,res) => {
  try {
      const pets = await petModel.find({category:req.body.breed});
      if(!pets){
        return res.send({
          status:422,
          success:false,
          message:"Pets not found"
        })
      }
      res.send({
        status:200,
        success:true,
        message:"Pets fetched Succesfully",
        data:pets
      })

  } catch (error) {
    
    res.send({
    status:422,
    success:false,
    message:"Something unexpected happened while fetchinG pets",
    error:err
  })
}
};


module.exports = {addPet, deletePet, getAllPet, getByCategory, getByBreed};