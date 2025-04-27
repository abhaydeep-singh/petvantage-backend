
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createMulter(folderName) {
  // Ensure the upload folder exists
  const uploadPath = path.join(__dirname, `../public/${folderName}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  return multer({ storage });
}

module.exports = createMulter;
