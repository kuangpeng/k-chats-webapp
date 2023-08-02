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

export const getMyGroups = () => {
  return request.get('/group')
}
