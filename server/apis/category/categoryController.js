const categoryModel = require("./categoryModel.js");

const addCat = async(req,res)=>{
    try {
        // Null Validation
        let err = [];
        const {name,image} = req.body;
        if(!name) err.push("Category name is required");
        if(!image) err.push("Image is required");
        if(err.length > 0) {
            return res.send({
                status:422,
                success:false,
                message:"Incomplete Data",
                errors:err
            
            })
        }

        const catObj = new categoryModel({name, image});

        const savedCategory = await catObj.save();
        if(savedCategory) {
            res.send({
                status:200,
                success:true,
                message:"Category added Succesfuly",
                data:savedCategory
    
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

const deleteCat = async(req,res)=>{
    try {
        const deleted = await categoryModel.deleteOne({_id:req.body._id});

    if(deleted.deletedCount == 1){
        return res.send({
            status:200,
            success:true,
            message:"Category Deleted Succesfully"
        })
    }
    else{
        return res.send({
            status:422,
            success:false,
            message:"Something went wrong while deleting Category"
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

module.exports = {addCat, deleteCat};