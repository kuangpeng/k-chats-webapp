const Users = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const APITool = require('./../utils/apiTool');

exports.getAll = catchAsync(async (req, res, next) => {
  const fetch = new APITool(Users.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await fetch.query;

  res.json({
    status: 'success',
    data: users
  });
});
