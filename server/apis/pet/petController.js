const petModel = require("./petModel.js");
// const breedModel = require("../breed/breedModel.js");
// const categoryModel = require("../category/categoryModel.js");
const { uploadImg } = require("../../utils/cloudinary.js");

const addPet = async (req, res) => {
  try {
    let errors = [];
    if (!req.body.name) errors.push("Name is required");
    if (!req.body.breed) errors.push("Breed is required");
    if (!req.body.category) errors.push("Category is required");
    // if (!req.body.addedByID) errors.push("'Added By' ID is required");
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
    const petObj = new petModel();
      petObj.name = req.body.name;
      petObj.breed = req.body.breed;
      petObj.category = req.body.category;
      petObj.addedByID = req.decoded._id;
      petObj.desc = req.body.desc;
      if (req.file) {
        try {
          let url = await uploadImg(req.file.buffer);
          petObj.image = url;
        } catch (err) {
          console.log(err);

          res.send({
            status: 400,
            success: false,
            message: "cloudnairy error!!",
          });
        }
      }
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
    const {_id} = req.body;
    if(!_id){
      return res.send({
        status:422,
        success:false,
        message:"ID is required"
      })
    }

    const data = await petModel.findOne({ _id: _id });
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

const updatePet = async (req, res) => {
  try {
    let errors = [];

    if (!req.body._id) errors.push("Pet ID is required");
    if (!req.body.name) errors.push("Name is required");
    if (!req.body.breed) errors.push("Breed is required");
    if (!req.body.category) errors.push("Category is required");
    if (!req.body.desc) errors.push("Description is required");
    if (!req.file) errors.push("Image is required");

    if (errors.length > 0) {
      return res.send({
        status: 422,
        success: false,
        message: "Incomplete data",
        errors: errors
      });
    }

    // Find pet by ID
    const pet = await petModel.findOne({_id:req.body._id});
    if (!pet) {
      return res.send({
        status: 404,
        success: false,
        message: "Pet not found"
      });
    }

    // Update pet fields
    pet.name = req.body.name;
    pet.breed = req.body.breed;
    pet.category = req.body.category;
    pet.desc = req.body.desc;
    if (req.file) {
            try {
              let url = await uploadImg(req.file.buffer);
              pet.image = url;
            } catch (err) {
              console.log(err);
    
              res.send({
                status: 400,
                success: false,
                message: "cloudnairy error!!",
              });
            }
          }

    const updatedPet = await pet.save();
    if(!updatedPet){
      return res.send({
        status: 422,
        success: false,
        message: "Something went wrong while updating pet"
      });
    }

    res.send({
      status: 200,
      success: true,
      message: "Pet updated successfully",
      data: updatedPet
    });

  } catch (err) {
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: err
    });
  }
};


// Generic Apis
const getSinglePet = async(req,res) =>{
  try {
    if(!req.body._id){
      return res.send({
        status:422,
        success:false,
        message:"ID is required"
      })
    }
    const data = await petModel.findOne({_id:req.body._id})
    if(!data){
      return res.send({
        status:422,
        success:false,
        message:"Something wrong happened while fetching data"
      })
    }
    return res.send({
      status:200,
      success:true,
      message:"Data Fecthed succesfully",
      data:data
    })
  
  } catch (err) {
    return res.send({
      status:422,
      success:false,
      message:"Internal Server Error",
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

const getByCategory = async(req,res) => {
  try {
      const pets = await petModel.find({category:req.body.category}).populate("addedByID");
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
    error:error
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

const getPagination = async (req, res) => {
  let errs = [];

  try {
    const { pageNo, limit } = req.body;
    if (!pageNo) {
      errs.push("Page no is required!")
    }
    if (!limit) {
      errs.push("limit is required!")
    }
    if (errs.length > 0) {
      return res.send({
        status: 422,
        success: false,
        message: errs
      })
    }
    let skip = 0;
    if (pageNo > 1) {
      skip = (pageNo - 1) * limit
    }

    let data = await petModel.find().skip(skip).limit(limit);
    if (!data) {
      return res.send({
        status: 422,
        success: false,
        message: "Something went wrong while fetching pagination data",
      })
    }
    res.send({
      status: 200,
      success: true,
      message: "Data loaded succesfully",
      data: data
    })
  }
  catch (error) {
    res.send({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error
    })
  }
};


module.exports = {addPet, deletePet, updatePet, getSinglePet, getAllPet, getByCategory, getByBreed , getPagination};