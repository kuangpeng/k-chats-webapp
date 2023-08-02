import debug from 'debug'

/**
 *
 * @param {String} action 功能操作
 * @param {String} message 打印信息
 */
const debugFn = (action) => {
  return debug('app:' + action)
}

export default debugFn
