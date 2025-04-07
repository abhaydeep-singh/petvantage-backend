const breedModel = require("./breedModel.js");

const addBreed = async(req,res)=>{
    try {
        // Null Validation
        let err = [];
        const {name,image,categoryID} = req.body;
        if(!name) err.push("Breed name is required");
        if(!image) err.push("Image is required");
        if(!categoryID) err.push("CategoryID is required");
        if(err.length > 0) {
            return res.send({
                status:422,
                success:false,
                message:"Incomplete Data",
                errors:err
            
            })
        }

        const breedObj = new breedModel({name, image, categoryID});

        const savedBreed = await breedObj.save();
        if(savedBreed) {
            res.send({
                status:200,
                success:true,
                message:"Breed added Succesfuly",
                data:savedBreed
    
            })
        }

    } catch (error) {
        res.send({
            status:500,
            success:false,
            message:"Internal Server Error",
            error:error
        })
      }
};

const deleteBreed = async(req,res)=>{
    try {
        if(!req.body._id){
            return res.send({
                status:422,
                success:false,
                message:"ID is required"
            });
        }

    const deleted = await breedModel.deleteOne({_id:req.body._id});

    if(deleted.deletedCount == 1){
        return res.send({
            status:200,
            success:true,
            message:"Breed Deleted Succesfully"
        })
    }
    else{
        return res.send({
            status:422,
            success:false,
            message:"Something went wrong while deleting Breed"
        })   
    }
    } catch (error) {
        res.send({
            status:500,
            success:false,
            message:"Internal Server Error",
            error:error
        })
      }
};

module.exports = {addBreed, deleteBreed};