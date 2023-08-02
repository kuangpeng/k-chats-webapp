const mongoose = require('mongoose');

const userGroupScheme = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, '缺少用户']
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
      required: [true, '缺少群id']
    },
    nickName: {
      type: String
    },
    remark: {
      type: String
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'UserGroup',
    toJSON: {
      virtuals: true
    }
  }
);

userGroupScheme.virtual('ownerInfo', {
  ref: 'Users',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

userGroupScheme.virtual('groupInfo', {
  ref: 'Groups',
  localField: 'groupId',
  foreignField: '_id',
  justOne: true
});

userGroupScheme.pre(/^find/, function (next) {
  this.populate({
    path: 'ownerInfo',
    select: '_id name avatar'
  }).populate({
    path: 'groupInfo',
    select: '_id groupName creator avatar members membersInfo'
  });

  next();
});

const UserGroup = mongoose.model('UserGroup', userGroupScheme);

module.exports = UserGroup;
