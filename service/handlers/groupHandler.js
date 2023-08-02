const debug = require('debug')('app:chat');
const Groups = require('./../models/groupModel');
const UserGroup = require('./../models/userGroupModel');
const catchAsyncSocket = require('./../utils/catchAsyncSocket');
const AppError = require('./../utils/appError');
const sessionStore = require('./../utils/sessionStore')();
const appConfig = require('./../app.config');
const HANDLERTYPE = require('./handlerType');

module.exports = async (io, socket) => {
  const createGroup = catchAsyncSocket(async (payload, callback) => {
    const user = socket.request.user;

    let { groupName, avatar, members } = payload;

    // 默认群名
    if (!groupName) {
      groupName = `${user.name}的群`;
    }
    if (!members || members.length == 0) {
      // return next(new AppError('缺少成员数据(members)', 404));
      return (
        typeof callback === 'function' &&
        callback(new AppError('缺少成员数据', 404))
      );
    }

    // 默认头像
    if (!avatar) {
      avatar = appConfig.group.avatar.default;
    }
    const uid = user.get('_id', String);
    // 添加创建者
    members = [uid, ...members];

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

    const myNewGroup = await UserGroup.findOne({
      owner: user._id,
      groupId: newGroup._id
    });

    // 将每位在线成员加入群room
    const groupMembersSocket = members.map((m) => {
      return sessionStore.findSession(m);
    });

    const allSockets = await io.fetchSockets();

    const newGroupId = newGroup.get('_id', String);
    groupMembersSocket.forEach((gm) => {
      if (!gm) return;
      let ms = allSockets.find((as) => as.id === gm.socketId);
      if (ms) {
        ms.join('group:' + newGroupId);
        ms.emit(HANDLERTYPE.GROUP.NEW, { groupId: newGroupId });
      }
    });

    typeof callback === 'function' && callback(myNewGroup);
  });

  // 将用户加入所在群room
  const user = socket.request.user;

  const groups = await UserGroup.find({
    owner: user._id
  }).select('groupId');

  if (groups && groups.length > 0) {
    groups.forEach((g) => {
      socket.join('group:' + g.get('groupId', String));
    });
  }
  //-------------------------------

  socket.on(HANDLERTYPE.GROUP.CREATE, createGroup);
};
