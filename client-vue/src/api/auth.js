import request from './../utils/request'

export const login = ({ userName, password }) => {
  return request.post('/login', {
    name: userName,
    password
  })
}

export const register = ({ userName, password, avatar }) => {
  return request.post('/register', {
    name: userName,
    password,
    avatar
  })
}
