import request from './../utils/request'

export const getContacts = (query) => {
  return request.get('/contact', {
    params: query
  })
}

export const getStrangers = () => {
  return request.get('/contact/my-strangers')
}

export const addContact = (data) => {
  return request.post('/contact', data)
}

export const updateContact = (id, data) => {
  return request.put(`/contact/${id}`, data)
}

export const getMyGroups = () => {
  return request.get('/group')
}

export const updateGroup = (id, data) => {
  return request.put(`/group/my/${id}`, data)
}
