import request from './../utils/request'

export const upload = (data) => {
  return request.post('/file/upload', data, {
    formData: true
  })
}
