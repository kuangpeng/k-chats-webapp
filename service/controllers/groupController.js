const Groups = require('./../models/groupModel');
const UserGroup = require('./../models/userGroupModel');
const Users = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APITool = require('../utils/apiTool');
const appConfig = require('./../app.config');
const debug = require('debug')('app:authController');

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const fetch = new APITool(Groups.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const groups = await fetch.query;

  res.json({
    status: 'success',
    data: groups
  });
});

// 查找我所在的群
exports.getMyGroups = catchAsync(async (req, res, next) => {
  const groups = await UserGroup.find({
    owner: req.user._id
  });

  res.json({
    status: 'success',
    data: groups
  });
});

// 建群
exports.createGroup = catchAsync(async (req, res, next) => {
  const user = req.user;

  let { groupName, avatar, members } = req.body;

  // 默认群名
  if (!groupName) {
    groupName = `${user.name}的群`;
  }
  if (!members || members.length == 0) {
    return next(new AppError('缺少成员数据(members)', 404));
  }

  // 默认头像
  if (!avatar) {
    avatar = appConfig.group.avatar.default;
  }
  // 添加创建者
  members = [user._id, ...members];

  const group = new Groups({
    groupName,
    creator: user._id,
    avatar,
    members
  });

  const newGroup = await group
    .save()
    .then((groups) => Groups.populate(groups, { path: 'membersInfo' }));

  const userGroups = newGroup.membersInfo.map((nm) => ({
    owner: nm._id,
    groupId: newGroup._id,
    nickName: nm.name,
    remark: groupName
  }));

  // 为群成员添加 群(UserGroup)
  await UserGroup.insertMany(userGroups);

  res.json({
    status: 'success',
    data: newGroup
  });
});

// 用户进群
exports.joinGroup = catchAsync(async (req, res, next) => {
  const groupId = req.params.id;

  const ids = req.body.members;

  const group = await Groups.findById(groupId);

  if (!group) {
    return next(new AppError('没有此群', 400));
  }

  group.members = group.members.concat(ids);

  const newMembers = await Users.find({
    _id: {
      $in: ids
    }
  });

  const newUserGroup = newMembers.map((nm) => ({
    owner: nm._id,
    groupId: group._id,
    nickName: nm.name,
    remark: group.groupName
  }));

  await group.save({
    members: group.members
  });

  await UserGroup.insertMany(newUserGroup);

  res.json({
    status: 'success'
  });
});

// 用户退群
exports.leaveGroup = catchAsync(async (req, res, next) => {
  const groupId = req.params.id;
  const uid = req.user._id;

  const group = await Groups.findById(groupId);

  if (!group) {
    return next(new AppError('没有此群', 400));
  }

  const members = group.members;
  let index = members.indexOf(uid);

  if (index === -1) {
    return next(new AppError('不在此群，不能进行操作', 403));
  }

  members.splice(index, 1);

  await group.save(members);

  await UserGroup.deleteOne({
    owner: uid,
    groupId
  });

  res.json({
    status: 'success'
  });
});
