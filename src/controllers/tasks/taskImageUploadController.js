const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("cb", cb, file);
    cb(null, '/var/www/html/uploads'); // Save files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    console.log("this is a file:",file);
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });
console.log("upload", upload);

// Route to handle image uploads
const postImage = (req, res) => {
  try {
    const imageUrls = req.files.map(
      file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    console.log(imageUrls);
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

module.exports = { postImage, upload };
