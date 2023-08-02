import { ACTIONTYPE, send } from './socket'
import debug from '@/utils/debug'
import { useContactsStore } from '@/stores/contacts'

export const createContact = (data) => {
  return {
    _id: data._id,
    contactId: data.contact,
    remark: data.remark,
    avatar: data.contactInfo.avatar,
    chatType: 'person'
  }
}

export const createStranger = (data) => {
  return {
    _id: data._id,
    id: data._id,
    name: data.name,
    avatar: data.avatar
  }
}

export const createGroup = (data) => {
  return {
    _id: data._id,
    groupId: data.groupId,
    owner: data.owner,
    nickname: data.nickname,
    remark: data.remark,
    avatar: data.groupInfo.avatar,
    membersInfo: data.groupInfo.membersInfo
  }
}

// 被添加联系人
const onNewContact = (payload) => {
  const contactsStore = useContactsStore()

  contactsStore.onNewContact(payload)
}

// 被加群
const onJoinGroup = (payload) => {
  console.log(payload)
  const contactsStore = useContactsStore()

  contactsStore.newGroupAdd()
}

// 发送添加联系人事件
const emitAddContact = (id) => {
  const contactsStore = useContactsStore()

  send(ACTIONTYPE.CONTACT.ADD, { contact: id })
    .then((res) => {
      contactsStore.addContact(createContact(res))
    })
    .catch((err) => {
      debug(ACTIONTYPE.CONTACT.ADD)(err)
    })
}

export default {
  onNewContact,
  onJoinGroup,
  emitAddContact
}
