import { io } from 'socket.io-client'
import debug from '@/utils/debug'

// const uri = import.meta.env.VITE_SOCKET_URL + '/message'
const uri = import.meta.env.VITE_SOCKET_URI

const socket = io(uri, {
  autoConnect: false

  // auth: {
  //   token: 'test'
  // }
})

socket.on('connect', () => {
  debug('socket')('socket connect success!')
  // state.connected = true;
  // state.currentUser = socket.id
})

socket.onAny((eventName, args) => {
  debug('socket:event')(eventName + ':' + JSON.stringify(args))
})

// socket connect error
socket.on('connect_error', (err) => {
  debug('socket:error')('socket connection error!')
  debug('socket:error')(err.message)
  // reconnect
  // socket.connect()
})

// listen socket disconnect
socket.on('disconnect', (reason) => {
  debug('socket:disconnect')('socket disconnected! due to ' + reason)
  if (reason === 'io server disconnect') {
    socket.connect()
  }
})

export default socket
