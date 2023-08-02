const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// TODO: 群头像
const contactsScheme = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, '缺少用户']
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, '缺少联系人id']
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
    collection: 'Contacts',
    toJSON: {
      virtuals: true
    }
  }
);

contactsScheme.virtual('ownerInfo', {
  ref: 'Users',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

contactsScheme.virtual('contactInfo', {
  ref: 'Users',
  localField: 'contact',
  foreignField: '_id',
  justOne: true
});

contactsScheme.pre(/^find/, function (next) {
  const selectFields = '_id name avatar';
  this.populate({
    path: 'ownerInfo',
    select: selectFields
  }).populate({
    path: 'contactInfo',
    select: selectFields
  });

  next();
});

const Contacts = mongoose.model('Contacts', contactsScheme);

module.exports = Contacts;
