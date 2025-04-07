const petModel = require("./petModel.js");
const breedModel = require("../breed/breedModel.js");
const categoryModel = require("../category/categoryModel.js");

const addPet = async (req, res) => {
  try {
    let errors = [];
    if (!req.body.name) errors.push("Name is required");
    if (!req.body.breedID) errors.push("Breed ID is required");
    if (!req.body.addedByID) errors.push("'Added By' ID is required");
    if (!req.body.image) errors.push("Image is required");
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
        breedID:req.body.breedID, //FIXME: add string here
        addedByID:req.body.addedByID, 
        image:req.body.image,
        desc:req.body.desc
    });
    const petData = await petObj.save();
    // if(!petData){
    //     res.send({
    //     status:422,
    //     success:false,
    //     message:"Something unexpected happened while saving pet data",
    //   })}


    // Create breed and category data!! TODO:

  } catch(err) {
    {
          res.send({
          status:422,
          success:false,
          message:"Something unexpected happened while saving pet data",
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

module.exports = {addPet, deletePet,getAllPet};