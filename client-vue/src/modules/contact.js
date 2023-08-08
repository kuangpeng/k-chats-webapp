import { ACTIONTYPE, send } from './socket'
import debug from '@/utils/debug'
import { useContactsStore } from '@/stores/contacts'
import converseModule from './converse'

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
    nickName: data.nickName,
    remark: data.remark,
    avatar: data.groupInfo.avatar,
    membersInfo: data.groupInfo.membersInfo,
    chatType: 'group'
  }
}

const addNewGroup = (res) => {
  const contactsStore = useContactsStore()

  const newGroup = createGroup(res)

  contactsStore.addNewGroup(newGroup)

  return newGroup
}

// 被添加联系人
const onNewContact = (payload) => {
  const contactsStore = useContactsStore()

  const newContact = contactsStore.onNewContact(payload)

  converseModule.addNewContactChat(newContact)
}

// 被加群
const onJoinGroup = (payload) => {
  // 添加新增群数据
  const newGroup = addNewGroup(payload)

  converseModule.addNewGroupChat(newGroup)
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
  emitAddContact,
  addNewGroup
}
