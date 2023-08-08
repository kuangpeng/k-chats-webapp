import request from './../utils/request'

export const getChats = (params) => {
  return request.get('/chat/groupby', {
    params
  })
}

export const getMoreChats = (params) => {
  return request.get('/chat/getMore', {
    params
  })
}

export const addChat = () => {
  return request.post('/chat')
}
