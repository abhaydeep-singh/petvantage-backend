const postModel = require("./postModel.js");
const {uploadImg} = require("../../utils/cloudinary.js");
const commentModel = require("../post/commentModel.js");

const addPost = async(req,res) => {
    try {
      let errs = [];
    const {content} = req.body;
    // const image = req.file;
    if(!content){errs.push("Content is Required")};
    // if(!addedByID){errs.push("Added By ID is Required")};
    
    if(errs.length > 0){
        return res.send({
            status:422,
            success:false,
            message:"Incomplete Data",
            errors:errs
        })
    }
    
    let postObj = new postModel();
    postObj.content = content
    postObj.addedBy = req.decoded._id //TODO:
    if (req.file) {
        try {
          let url = await uploadImg(req.file.buffer);
          postObj.image = url;
        } catch (err) {
          console.log(err);

          res.send({
            status: 400,
            success: false,
            message: "cloudnairy error!!",
          });
        }
      }

    const savedPost = await postObj.save();
    if(!savedPost){
        return res.send({
            status:422,
            success:false,
            message:"Something went wrong while saving post",

        })
    }

    res.send({
        status:200,
        success:true,
        message:"Post Saved Succesfully",
        data:savedPost
    })
    } catch (error) {
      res.send({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error:error
      });
    }

};

const updatePost = async (req, res) => {
  const { _id, content } = req.body;
  let errs = [];

  if (!_id) errs.push("Post ID is required");
  if (!content && !req.file) errs.push("Nothing to update");

  if (errs.length > 0) {
    return res.send({
      status: 422,
      success: false,
      message: "Incomplete Data",
      errors: errs,
    });
  }

  try {
    let post = await postModel.findOne({ _id });
    if (!post) {
      return res.send({
        status: 404,
        success: false,
        message: "Post not found",
      });
    }

    if (content) post.content = content;

    if (req.file) {
      try {
        let url = await uploadImg(req.file.buffer);
        post.image = url;
      } catch (err) {
        console.log(err);
        return res.send({
          status: 400,
          success: false,
          message: "Cloudinary error!",
        });
      }
    }

    let updatedPost = await post.save();

    res.send({
      status: 200,
      success: true,
      message: "Post Updated Successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.send({
      status: 422,
      success: false,
      message: "Post ID is required",
    });
  }

  try {
    let deleted = await postModel.findByIdAndDelete(_id);
    if (!deleted) {
      return res.send({
        status: 404,
        success: false,
        message: "Post not found",
      });
    }

    res.send({
      status: 200,
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addComment = async (req,res) => {
  let errs = [];
  const{comment, postID} = req.body;
  if(!comment){errs.push("Comment is required")}
  if(!postID){errs.push("Post ID is required")}
  if(errs.length > 0){
    return res.send({
      status:422,
      success:false,
      message:"Incomplete Data",
      error:errs
    })
  }
  // take userid from decoded
  try {
    let commentObj = new commentModel({
      comment,
      // postID,
      userID:req.decoded._id
    });
    let savedComment = await commentObj.save();
    if(!savedComment){
      return res.send({
        status: 422,
        success: false,
        message: "Something went wrong while adding comment",
      })
    }
  
    // Now add this comment's id in Post Model
    let updatedPost = await postModel.findByIdAndUpdate(
      postID,
      { $push: { commentIDs: savedComment._id } }, //IMPORTANT, now it will not overwrite but push into the Array
      { new: true }
    );
    if(!updatedPost){
      return res.send({
        status: 422,
        success: false,
        message: "Something went wrong while adding comment ID to post model",
      })
    }

    res.send({
      status:200,
      success:true,
      message:"Comment Added Succesfully",
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
  const{commentID, postID} = req.body;
  if(!commentID){errs.push("Comment is required")}
  if(!postID){errs.push("Post ID is required")}
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
    let updatedPost = await postModel.findByIdAndUpdate(
      postID,
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





const getSingle = async(req,res) =>{
  try {
    const {_id} = req.body;
  if(!_id){
     return res.send({
      status:422,
      success:false,
      message:"id is required"
    })}
    let postData = await postModel.findOne({_id:_id});
    if(!postData){
      res.send({
        status:422,
        success:false,
        message:"Data not found"
      })
    }
    res.send({
      status: 200,
      success: true,
      message: "Data loaded succesfully",
      data: postData
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

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate("addedBy").populate("commentIDs").sort({createdAt:-1})

    if (!posts) {
      return res.send({
        status: 404,
        success: false,
        message: "No posts found",
      });
    }

    res.send({
      status: 200,
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error:error.message
    });
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

    let data = await postModel.find().skip(skip).limit(limit);
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



module.exports = { addPost, getSingle, addComment, deleteComment, updatePost, deletePost, getAllPosts, getPagination};
