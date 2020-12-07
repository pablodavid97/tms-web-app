const multer = require('multer');

// Image properties
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
};

var imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, global.appRoot + '/public/img/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

var imageUpload = multer({ storage: imageStorage, fileFilter: imageFilter });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('text/csv')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
};

var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, global.appRoot + '/public/tmp/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '.csv');
  }
});

var fileUpload = multer({storage: fileStorage, fileFilter: fileFilter});

module.exports = {imageUpload, fileUpload};
