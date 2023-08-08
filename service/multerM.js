const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files');
  },
  filename: (req, file, cb) => {
    // 文件名取 时间戳和原文件的后缀名进行组合
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = (() => {
  return multer({
    storage
  });
})();

module.exports = upload;
