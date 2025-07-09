const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images'); // files go to /backend/images
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = path.extname(file.originalname);
        callback(null, name + Date.now() + extension);
    },
});

module.exports = multer({ storage }).single('image');