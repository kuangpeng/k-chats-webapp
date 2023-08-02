const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const debug = require('debug')('app:authController');
const APITool = require('./../utils/apiTool');

const Chats = require('./../models/chatModel');
const UserGroup = require('./../models/userGroupModel');

exports.addChat = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { receiver, groupId, body, chatType, sendAt } = req.body;

  if (
    !chatType ||
    !body ||
    (chatType == 'person' && !receiver) ||
    (chatType == 'group' && !groupId)
  ) {
    return next(new AppError('缺少数据', 400));
  }

  let data = {
    body,
    sender: user._id,
    chatType,
    sendAt
  };

  if (chatType == 'person') {
    data['receiver'] = receiver;
  } else {
    data['groupId'] = groupId;
  }

  const chat = new Chats(data);

  await chat.save();

  res.json({
    status: 'success'
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  const { sender, receiver, groupId, chatType } = req.query;

  // if (!chatType) {
  //   return next(new AppError('缺少类型数据'), 404);
  // }

  const groups = await UserGroup.find({
    owner: req.user._id
  }).select('groupId');

  const gids = groups.map((g) => g.get('groupId', String));

  req.query['$or'] = [
    { groupId: { $in: gids }, chatType: 'group' },
    { sender: req.user._id, chatType: 'person' },
    { receiver: req.user._id, chatType: 'person' }
  ];

  // 限制获取50条
  req.query['limit'] = 1000;

  const fetch = new APITool(Chats.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const chats = await fetch.query;

  res.json({
    status: 'success',
    num: chats.length,
    data: chats
  });
});

// TODO: query chats by contactid group
exports.getChatsGroup = catchAsync(async (req, res, next) => {
  // const groups = await UserGroup.find({
  //   owner: req.user._id
  // }).select('groupId');

  // const gids = groups.map((g) => g.get('groupId', String));

  // req.query['$or'] = [
  //   { groupId: { $in: gids }, chatType: 'group' },
  //   { sender: req.user._id, chatType: 'person' },
  //   { receiver: req.user._id, chatType: 'person' }
  // ];

  // // 限制获取50条
  // req.query['limit'] = 50;

  // const fetch = new APITool(Chats.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const chats = await fetch.query;

  const aggregateContact = Chats.aggregate([
    {
      $lookup: {
        from: 'Contacts',
        left: {},
        pipeline: [
          {
            $match: {
              $or: [{ owner: req.user._id }]
            }
          }
        ],
        as: 'myContacts'
      }
    }
    // {
    //   $match: {
    //     $or: [
    //       { groupId: { $in: '$gid' }, chatType: 'group' },
    //       { sender: req.user._id, chatType: 'person' },
    //       { receiver: req.user._id, chatType: 'person' }
    //     ]
    //   }
    // }
    // {
    //   $group: {
    //     _id:
    //   }
    // }
  ]);
  const chats = await aggregateContact.exec();

  res.json({
    status: 'success',
    num: chats.length,
    data: chats
  });
});
