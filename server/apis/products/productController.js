const productModel = require("./productModel.js");
const { uploadImg } = require("../../utils/cloudinary.js");

const addProduct = async (req, res) => {
    try {
        let errs = [];
        const { title, desc, cost } = req.body;
        // const image = req.file;
        if (!title) { errs.push("Title is Required") };
        if (!desc) { errs.push("Description is Required") };
        if (!req.file) { errs.push("Image is Required") };
        if (!cost) { errs.push("Cost is Required") };

        if (errs.length > 0) {
            return res.send({
                status: 422,
                success: false,
                message: "Incomplete Data",
                errors: errs
            })
        }

        let productObj = new productModel();
        productObj.title = title;
        productObj.desc = desc;
        productObj.cost = cost;
        if (req.file) {
            try {
                let url = await uploadImg(req.file.buffer);
                productObj.image = url;
            } catch (err) {
                console.log(err);

                return res.send({
                    status: 400,
                    success: false,
                    message: "cloudnairy error!!",
                });
            }
        }

        const savedProduct = await productObj.save();
        if (!savedProduct) {
            return res.send({
                status: 422,
                success: false,
                message: "Something went wrong while saving post",

            })
        }

        res.send({
            status: 200,
            success: true,
            message: "Post Saved Succesfully",
            data: savedProduct
        })



    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        let errs = [];
        const { title, desc, cost, productId } = req.body;
        // const productId = req.params.id;

        if (!productId) { errs.push("Product ID is Required") };
        if (!title) { errs.push("Title is Required") };
        if (!desc) { errs.push("Description is Required") };
        if (!cost) { errs.push("Cost is Required") };

        if (errs.length > 0) {
            return res.send({
                status: 422,
                success: false,
                message: "Incomplete Data",
                errors: errs
            });
        }

        let updatedFields = { title, desc, cost };

        if (req.file) {
            try {
                let url = await uploadImg(req.file.buffer);
                updatedFields.image = url;
            } catch (err) {
                console.log(err);
                return res.send({
                    status: 400,
                    success: false,
                    message: "cloudnairy error!!",
                });
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedFields, { new: true });

        if (!updatedProduct) {
            return res.send({
                status: 404,
                success: false,
                message: "Product not found or not updated",
            });
        }

        res.send({
            status: 200,
            success: true,
            message: "Product Updated Successfully",
            data: updatedProduct
        });

    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {productId} = req.body;

        if (!productId) {
            return res.send({
                status: 422,
                success: false,
                message: "Product ID is Required"
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.send({
                status: 404,
                success: false,
                message: "Product not found or already deleted"
            });
        }

        res.send({
            status: 200,
            success: true,
            message: "Product Deleted Successfully",
            data: deletedProduct
        });

    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();

        if (!products || products.length === 0) {
            return res.send({
                status: 404,
                success: false,
                message: "No products found"
            });
        }

        res.send({
            status: 200,
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {addProduct, updateProduct, deleteProduct, getAllProducts };












