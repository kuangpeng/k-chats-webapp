const mongoose = require('mongoose');

const chatsScheme = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, '请填写消息主体']
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, '请填写消息发送者']
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      validate: {
        validator: function (v) {
          if (this.chatType === 'person') {
            return v;
          } else {
            return true;
          }
        },
        message: '请填写消息接收者'
      }
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Groups',
      validate: {
        validator: function (v) {
          if (this.chatType === 'group') {
            return v;
          } else {
            return true;
          }
        },
        message: '群聊消息缺少群id'
      }
    },
    chatType: {
      type: String,
      enum: {
        values: ['person', 'group'],
        message: '消息类型'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['0', '1']
      },
      default: '1'
    },
    sendAt: {
      type: Date,
      default: Date.now
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Chats',
    toJSON: {
      virtuals: true
    }
  }
);

chatsScheme.virtual('senderInfo', {
  ref: 'Users',
  localField: 'sender',
  foreignField: '_id',
  justOne: true
});

chatsScheme.virtual('receiverInfo', {
  ref: 'Users',
  localField: 'receiver',
  foreignField: '_id',
  justOne: true
});

chatsScheme.virtual('groupInfo', {
  ref: 'Groups',
  localField: 'groupId',
  foreignField: '_id',
  justOne: true
});

chatsScheme.pre(/^find/, function (next) {
  let userFields = '_id name avatar';
  this.populate({
    path: 'senderInfo',
    select: userFields
  })
    .populate({
      path: 'receiverInfo',
      select: userFields
    })
    .populate({
      path: 'groupInfo',
      select: '_id groupName creator'
    });

  next();
});

// chatsScheme.pre('save', async function (next) {
//   next();
// });

const Chats = mongoose.model('Chats', chatsScheme);

module.exports = Chats;
