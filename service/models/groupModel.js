const mongoose = require('mongoose');
const appConfig = require('./../app.config');
const _ = require('lodash');

const groupsScheme = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: [true, '缺少群名称']
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, '缺少创建者']
    },
    avatar: {
      type: String
    },
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
      required: [true, '缺少成员id']
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Groups',
    toJSON: {
      virtuals: true
    }
  }
);

groupsScheme.virtual('creatorInfo', {
  ref: 'Users',
  localField: 'creator',
  foreignField: '_id',
  justOne: true
});

groupsScheme.virtual('membersInfo', {
  ref: 'Users',
  localField: 'members',
  foreignField: '_id',
  justOne: false
});

groupsScheme.pre(/^find/, function (next) {
  const selectFields = '_id name avatar';
  this.populate({
    path: 'creatorInfo',
    select: selectFields
  }).populate({
    path: 'membersInfo',
    select: selectFields
  });

  next();
});

groupsScheme.post(/^find/, function (result) {
  if (_.isArray(result)) {
    result = result.map((r) => {
      r.avatar = appConfig.locUri + r.avatar;
      return r;
    });
  } else {
    if (result) result.avatar = appConfig.locUri + result.avatar;
  }
});

groupsScheme.methods.checkUserIsExited = async function (id) {
  return new Promise((resolve, reject) => {
    resolve(this.members.includes(id));
  });
};

const Groups = mongoose.model('Groups', groupsScheme);

module.exports = Groups;
