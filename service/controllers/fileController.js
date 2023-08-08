const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const upload = require('./../multerM').single('avatar');
const appConfig = require('./../app.config');

exports.upload = catchAsync(async (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return next(new AppError('上传过程中发生错误', 500));
    } else if (err) {
      console.log(err);
      return next(new AppError('上传过程中发生错误', 500));
    }

    const result = req.file.path.split('\\');

    result.shift();

    console.log(result);
    const avatar = '/' + result.join('/');
    const realUrl = appConfig.locUri + avatar;

    res.send({
      status: 'success',
      data: {
        url: realUrl,
        avatar
      }
    });
  });
});
