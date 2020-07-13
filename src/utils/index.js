function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function deepCopy (objTo, objFrom) {
  Object.keys(objFrom).map(key => {
    if (Object.prototype.toString.call(objFrom[key]) === '[object Object]') {
      deepCopy(objTo[key], objFrom[key])
    } else {
      objTo[key] = objFrom[key]
    }
  })
}

export function debounce (fn, delay = 300){
  var timer = null
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

export function formatTime (val, fmt) {
  if (!val) return val
  const date = new Date(/^\d+(\.\d{2})?$/.test(val) ? new Date(parseInt(val)) : new Date(val.indexOf('.') !== -1 ? val.replace(/(-)/g, '/').substring(0, val.indexOf('.')) : val.replace(/(-)/g, '/')).getTime())
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  const week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export default {
  formatNumber,
  formatTime,
  deepCopy,
  debounce
}
