const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "drn9itn5m",
    api_key: "931369499397273",
    api_secret: "dhSVeUc8HHuZOBu6nVW-AyaPuBM",
    secure: true,
    cdn_subdomain: true,
});

const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};

module.exports = {uploadImg}

