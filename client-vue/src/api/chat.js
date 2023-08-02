import request from './../utils/request'

export const getChats = (params) => {
  return request.get('/chat', {
    params
  })
}

export const addChat = () => {
  return request.post('/chat')
}
