import Vue from 'vue'
import http from '@/http'
import { dateFormat, loadJs } from '@utils/index'
import domPortal from '@plugins/domPortal'
import toast from '@components/Toast'
import router from './router'
import App from './App.vue'
import '@styles/public.css'

Vue.filter('date', dateFormat)
Vue.directive('dom-portal', domPortal)
Object.assign(Vue.prototype, {
  $toast: toast,
  $http: http
})
// loadJs(window.VConsole, 'https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js', () => {
//   new window.VConsole()
// })
loadJs(window.wx, 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js')
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
