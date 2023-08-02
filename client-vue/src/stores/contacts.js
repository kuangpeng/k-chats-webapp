import { defineStore } from 'pinia'
import { getContacts, getStrangers, getMyGroups } from '@/api/contacts'
import { createContact, createStranger } from '@/modules/contact'

export const useContactsStore = defineStore('contacts', () => {
  const strangers = ref([])
  const contacts = ref([])
  const groups = ref([])

  function initContacts() {
    return new Promise((resolve, reject) => {
      getContacts()
        .then((res) => {
          contacts.value = res.data.map((d) => createContact(d))
          resolve()
        })
        .catch((err) => {
          console.error('getContacts', err)
          reject()
        })
    })
  }

  function initStrangers() {
    return new Promise((resolve, reject) => {
      getStrangers()
        .then((res) => {
          strangers.value = res.data.map((d) => createStranger(d))
          resolve()
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  }

  function initGroups() {
    return new Promise((resolve, reject) => {
      getMyGroups()
        .then((res) => {
          groups.value = res.data
          resolve()
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  }

  function findContact(id) {
    return contacts.value.find((c) => c.contactId === id)
  }

  function findGroup(id) {
    return groups.value.find((c) => c.groupId === id)
  }

  function addContact(nc) {
    contacts.value.push(nc)
    updateStrangers(nc.contactId)
  }

  // 被添加好友提醒
  function onNewContact(payload) {
    const newContact = createContact(payload)
    if (findContact(newContact.id)) return false

    // alert notify message

    // add contact data
    contacts.value.push(newContact)
  }

  // 被加入群提醒
  // TODO:
  async function newGroupAdd() {
    await initGroups()
  }

  // 添加好友后删除此项
  function updateStrangers(id) {
    let index = strangers.value.findIndex((i) => i._id === id)

    strangers.value.splice(index, 1)

    // initContacts()
  }

  return {
    contacts,
    initContacts,
    strangers,
    initStrangers,
    updateStrangers,
    groups,
    initGroups,
    addContact,
    onNewContact,
    newGroupAdd,
    findContact,
    findGroup
  }
})
