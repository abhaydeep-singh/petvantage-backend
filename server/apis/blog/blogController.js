const blogModel = require("./blogModel.js");
const commentModel = require("../post/commentModel.js");
// const mongoose = require("mongoose");

const addBlog = async (req, res) => {
    try {
        let errs = [];
        const { title, content } = req.body;

        if (!title) { errs.push("Title is required") };
        if (!content) { errs.push("Content is required") };

        if (errs.length > 0) {
            return res.send({
                status: 422,
                success: false,
                message: "Incomplete data",
                errors: errs
            })
        }

        const blogObj = new blogModel({
            title,
            content,
            addedByID: req.decoded._id
        });
        const savedData = await blogObj.save();

        if (!savedData) {
            return res.send({
                status: 422,
                success: false,
                message: "Blog Not Saved",
            })
        }
        return res.send({
            status: 200,
            success: true,
            message: "Blog Uploaded succesfully",
            data: savedData
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

const getAll = async (req, res) => {
    try {
        const blogs = await blogModel.find().populate("addedByID");

        if (!blogs) {
            return res.send({
                status: 422,
                success: false,
                message: "Something went wrong while fetching Blogs",
            })
        }

        return res.send({
            status: 200,
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        });
    } catch (error) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const getSingle = async (req, res) => {
    try {
        if (!req.body._id) {
            return res.send({
                status: 422,
                success: false,
                message: "Blog ID is required"
            })
        }
        const data = await blogModel.findOne({ _id: req.body._id }).populate("addedByID");

        if (!data) {
            return res.send({
                status: 422,
                success: false,
                message: "Something wrong happened while fetching data"
            })
        }
        return res.send({
            status: 200,
            success: true,
            message: "Data Fecthed succesfully",
            data: data
        })

    } catch (err) {
        return res.send({
            status: 422,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
};

const addComment = async (req, res) => {    
    let errs = [];
    const { comment, blogID } = req.body;
    if (!comment) { errs.push("Comment is required") }
    if (!blogID) { errs.push("Blog ID is required") }
    if (errs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: "Incomplete Data",
            error: errs
        })
    }
    // take userid from decoded
    try {
        let commentObj = new commentModel({
            comment,
            // blogID,
            userID: req.decoded._id
        });
        let savedComment = await commentObj.save();
        if (!savedComment) {
            return res.send({
                status: 422,
                success: false,
                message: "Something went wrong while adding comment",
            })
        }

        // Now add this comment's id in Post Model
        let updatedBlog = await blogModel.findByIdAndUpdate(
            blogID,
            { $push: { commentIDs: savedComment._id } }, //IMPORTANT, now it will not overwrite but push into the Array
            { new: true }
        );
        if (!updatedBlog) {
            return res.send({
                status: 422,
                success: false,
                message: "Something went wrong while adding comment ID to Blog model",
            })
        }

        res.send({
            status: 200,
            success: true,
            message: "Comment Added Succesfully",
            data: savedComment
        })



    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal server error",
            error: error
        })
    }
};

const deleteComment = async (req, res) => {
  let errs = [];
  const{commentID, blogID} = req.body;
  if(!commentID){errs.push("Comment is required")}
  if(!blogID){errs.push("Blog ID is required")}
  if(errs.length > 0){
    return res.send({
      status:422,
      success:false,
      message:"Incomplete Data",
      error:errs
    })
  }

  try {
    //Delete from Comment model
    let deletedComment = await commentModel.findByIdAndDelete(commentID);
    if (!deletedComment) {
      return res.send({
        status: 422,
        success: false,
        message: "Comment not found or already deleted",
      });
    }

    // Remove the comment ID from the post's comment array
    let updatedPost = await blogModel.findByIdAndUpdate(
        blogID,
      { $pull: { comment: commentID } }, //IMPORTANT
      { new: true }
    );

    if (!updatedPost) {
      return res.send({
        status: 422,
        success: false,
        message: "Post not found or something went wrong with the post update",
      });
    }

    res.send({
      status: 200,
      success: true,
      message: "Comment deleted successfully",
      data: deletedComment,
    });
  } catch (error) {
    res.send({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getComments = async (req, res) => {
    try {
        const data = await blogModel.find().populate({
    path: 'commentIDs',
    populate: {
      path: 'userID',
      model: 'user',
    }
  });
        if (!data) {
            return res.send({
                status: 422,
                success: false,
                message: "Something went wrong while fetching Comments",
            })
        }

        return res.send({
            status: 200,
            success: true,
            message: "Data Fecthed succesfully",
            data: data
        })
    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal server error",
            error: error
        })
    }
};
module.exports = { addBlog, getAll, getSingle, addComment, getComments, deleteComment }; 