const petModel = require("../pet/petModel.js");
const adoptionModel = require("./adoptionModel.js");

const makeReq = async(req,res)=>{
    let errs = [];
    const {petID, desc} = req.body;
    
    // console.log(req)
    if(!petID){
        errs.push("pet ID is required")
    }
    // if(!reqUserID){
    //     errs.push("Req User's ID is required")
    // }
    if(!desc){
        errs.push("Description is required")
    }
    if(errs.length>0){
      return res.send({
            status:422,
            success:false,
            message:"Incomplete data",
            errors:errs
          })
    }

    const adoptionObj = new adoptionModel({
        petID,
        reqUserID:req.decoded._id,
        desc,
        adoptionStatus:"pending"
    });
    const savedData = await adoptionObj.save();


    const petData = await petModel.findOne({_id:petID})
    petData.alreadyRequested = true;
    const updateRequest = await petData.save();

    if(!savedData){
        return res.send({
            status:422,
            success:false,
            message:"Data Not Saved",
          })
    }
    return res.send({
        status:200,
        success:true,
        message:"Adoption data saved succesfully",
      })
};

const updateReq = async(req,res)=>{
    try {
        let errs = [];
    const { reqID, adoptionStatus } = req.body;
    if(!reqID){
        errs.push("Request ID is required")
    }
    if(errs>0){
      return res.send({
            status:422,
            success:false,
            message:"Incomplete data",
            errors:errs
          })
    }

    const reqData = await adoptionModel.findOne({_id:reqID});
    if(!reqData){
        return res.send({
          status:422,
          success:false,
          message:"Adoption Req. not found"
        })
      }
    reqData.adoptionStatus = adoptionStatus;
    
    const updatedReqData = await reqData.save();

    // if(alreadyRequested){
    //   let res = await petModel.findOne({petID})
    //   req.alreadyRequested = alreadyRequested;
    //   let updatedPet = await res.save();
    // }
    if (updatedReqData) {
        return res.send({
          status:200,
          success:true,
          message:"Adoption Request Updated Succesfully",
          data:updatedReqData
        })
      }
    } catch(err) {
    
        res.send({
        status:422,
        success:false,
        message:"Internel Server Error",
        error:err
      })
}

};

// Pay attention to this, it change status in Pet model too
const deleteReq = async(req,res)=>{
  try {
    const {reqID, petID} = req.body;
  let deleteReq = await adoptionModel.findByIdAndDelete(reqID);
  
  let pet = await petModel.findOne({_id:petID})
  pet.alreadyRequested = false;
  let updatedPet = pet.save();

  if(!deleteReq){
    return res.send({
      status:422,
      success:false,
      message:"Something went wrong while deleting Adoption Request | Doc not found",
    })
  }

  return res.send({
    status:200,
    success:true,
    message:"Adoption Request Deleted Succesfully",
    data:deleteReq
  })
  } catch (error) {
    res.send({
      status:422,
      success:false,
      message:"Internel Server Error",
      error:error
    })
  }
};

const getAll = async (req, res) => {
  try {
    const adoptionRequests = await adoptionModel.find()
    .populate({
      path: "petID", // Nested Populate
      populate: {
        path: "addedByID", // This is inside the pet document
        model: "user"      // The model name for user
      }
    })
    .populate("reqUserID");

    if (!adoptionRequests || adoptionRequests.length === 0) {
      return res.send({
        status: 404, 
        success: false,
        message: "No adoption requests found",
      });
    }

    return res.send({
      status: 200,
      success: true,
      message: "Adoption requests fetched successfully",
      data: adoptionRequests,
    });
  } catch (err) {
    return res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


module.exports = {makeReq, updateReq, getAll, deleteReq};