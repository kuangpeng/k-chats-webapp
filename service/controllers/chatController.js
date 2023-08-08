const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const debug = require('debug')('app:authController');
const APITool = require('./../utils/apiTool');

const Chats = require('./../models/chatModel');
const UserGroup = require('./../models/userGroupModel');
const Contacts = require('./../models/contactModel');

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

exports.getChatsGroup = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const limitNum = 10;

  const aggregateContact = Contacts.aggregate([
    {
      $match: { owner: userId }
    },
    {
      $project: { _id: 1, contact: 1, owner: 1, contactInfo: 1, remark: 1 }
    },
    {
      $lookup: {
        from: 'Chats',
        let: { contactId: '$contact', ownerId: '$owner' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$receiver', '$$contactId'] },
                          { $eq: ['$sender', '$$ownerId'] }
                        ]
                      },
                      {
                        $and: [
                          { $eq: ['$receiver', '$$ownerId'] },
                          { $eq: ['$sender', '$$contactId'] }
                        ]
                      }
                    ]
                  },
                  { $eq: ['$chatType', 'person'] }
                ]
              }
            }
          },
          { $limit: limitNum }
        ],
        as: 'records'
      }
    }
  ]);

  const aggregateGroup = UserGroup.aggregate([
    {
      $match: { owner: userId }
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        groupId: 1,
        groupInfo: 1,
        nickName: 1,
        remark: 1
      }
    },
    {
      $lookup: {
        from: 'Chats',
        let: { groupID: '$groupId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$chatType', 'group'] },
                  { $eq: ['$groupId', '$$groupID'] }
                ]
              }
            }
          },
          { $limit: limitNum }
        ],
        as: 'records'
      }
    }
  ]);
  const chatsContact = await aggregateContact.exec();
  const chatsGroup = await aggregateGroup.exec();

  const populateOpt = [
    {
      path: 'senderInfo',
      select: '_id name avatar'
    },
    {
      path: 'receiverInfo',
      select: '_id name avatar'
    }
  ];

  const resultPromiseC = chatsContact
    .filter((c) => c.records.length > 0)
    .map(async (c) => {
      c = await Contacts.populate(c, {
        path: 'contactInfo',
        select: '_id name avatar'
      });
      c.records = await Chats.populate(c.records, populateOpt);
      c['chatType'] = 'person';

      return c;
    });
  const resultC = await Promise.all(resultPromiseC);

  const resultPromiseG = chatsGroup
    .filter((c) => c.records.length > 0)
    .map(async (c) => {
      const recordsInfo = await Chats.populate(c.records, populateOpt);
      c = await UserGroup.populate(c, {
        path: 'groupInfo',
        select: '_id groupName creator avatar members membersInfo'
      });
      c['chatType'] = 'group';
      c['records'] = recordsInfo;

      return c;
    });
  const resultG = await Promise.all(resultPromiseG);

  res.json({
    status: 'success',
    data: [...resultC, ...resultG]
    // data: resultG
  });
});

exports.getChatsGroupByDate = catchAsync(async (req, res, next) => {
  const uid = req.user._id;
  const { chatType, lastSendAt, id } = req.query;

  const limitNum = 10;

  const querySql = {
    chatType,
    createAt: { lt: new Date(lastSendAt) },
    limit: limitNum
  };

  if (chatType === 'person') {
    querySql['$or'] = [
      {
        sender: id,
        receiver: uid,
        chatType: 'person'
      },
      {
        sender: uid,
        receiver: id,
        chatType: 'person'
      }
    ];
  } else {
    querySql['groupId'] = id;
  }

  const fetch = new APITool(Chats.find(), querySql).filter();

  const chats = await fetch.query;

  res.json({
    status: 'success',
    data: chats
  });
});
