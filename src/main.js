import Vue from 'vue'
import App from './App'
import http from '@/api'
import store from '@/store'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$http = http
Vue.prototype.$store = store
const token = wx.getStorageSync('TOKEN')
if (!token) {
  wx.navigateTo({url: '/pages/setting/index/main?login=0'})
}

const app = new Vue(App)
app.$mount()
