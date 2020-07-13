import Vue from 'vue'
import Vuex from 'vuex'
import { deepCopy } from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    imei: ''
  },
  mutations: {
    /**
     * 这里设置一个统一的方法,大部分用的vuex都是简单的改变一些状态,不需要写过多的mutations
     * 使用方法 例:
     * this.$store.update({token: '123456'})
     * 
     *  config需要传入对象
     * @param {*} state 
     * @param {*Object} config 
     */
    update(state, config) {
      deepCopy(state, config)
    }
  }
})

export default store
