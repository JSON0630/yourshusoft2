const host = 'https://api.youshusoft.com'
const context = '/gpsserver/api'

export default {
  post: (url, data) => new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: host + context + url,
      data,
      header: {
        'token': wx.getStorageSync('TOKEN'),
        'version': 'v1.0'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }
        const { code, msg } = res.data
        if ([-100, -101].includes(code)) {
          wx.showToast({ title: msg, icon: 'none' })
          return wx.reLaunch({url: '/pages/setting/index/main?login=0'})
        }
        res.data.success = code === 0
        resolve(res.data);
      },
      fail: function (res) {
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}