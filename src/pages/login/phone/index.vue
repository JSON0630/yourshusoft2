<template>
  <div class="PhoneLogin">
    <img class="img_loc" src="/static/resources/login/loc.png" />
    <div class="user_login">用户登录</div>
    <div class="form_item">
      <div class="label">+86</div>
      <input v-model="keys.mobile" class="input" type="text" placeholder="请输入手机号">
    </div>
    <div class="form_item">
      <div class="label">验证码</div>
      <input v-model="keys.smsCode" class="input" type="text" placeholder="请输入验证码">
      <button class="button" :class="{time: time > 0}" @click="sendCode">{{ time > 0 ? time + 's' : '获取验证码'}}</button>
    </div>
    <div class="link">
      <navigator class="link_item" url="/pages/login/account/main">账号密码登录</navigator>
    </div>
    <ThirdLogin @login="login"/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ThirdLogin from '../comp/ThirdLogin'

export default {
  components: { ThirdLogin },
  data: () => ({
    keys: {
      mobile: '',
      smsCode: ''
      // mobile: '18222664400',
      // smsCode: '20200125'
    },
    time: 0
  }),
  watch: {
    time (c) {
      if (c > 0) {
        setTimeout(() => { this.time-- }, 1000)
      }
    }
  },
  methods: {
    ...mapMutations(['update']),
    async sendCode () {
      const { mobile } = this.keys
      const { success, data, msg } = await this.$http.smsSendCode({mobile})
      console.log(success)
      if (success) {
        this.time = 30
        wx.showToast({ title: '发送成功', icon: 'success' })
      } else {
        wx.showToast({ title: msg, icon: 'none' })
      }
    },
    async login () {
      const { mobile, smsCode } = this.keys
      if (!mobile) { return wx.showToast({ title: '请输入手机号', icon: 'none' }) }
      if (!smsCode) { return wx.showToast({ title: '请输入验证码', icon: 'none' }) }
      const { success, data, msg } = await this.$http.userMobileLogin({mobile, smsCode})
      if (!success) {
        return wx.showToast({ title: msg, icon: 'none' })
      }
      wx.setStorageSync('USER_NAME', data.userName)
      wx.setStorageSync('TOKEN', data.token)
      wx.reLaunch({url: '/pages/home/index/main'})
    }
  }
}
</script>

<style lang="less">
.PhoneLogin {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .user_login {
    color: #666;
    font-size: 28rpx;
    margin-top: 40rpx;
    margin-bottom: 68rpx;
  }
  .form_item {
    display: flex;
    align-items: center;
    width: 575rpx;
    height: 7.72vh;
    background: #eee;
    border-radius: 7.72vh;
    margin-bottom: 26rpx;
    .label {
      width: 160rpx;
      color: #666;
      font-size: 28rpx;
      text-align: center;
    }
    .input {
      flex: 1;
      color: #888;
    }
    .button {
      width: 170rpx;
      height: 6.2vh;
      line-height: 6.2vh;
      font-size: 20rpx;
      border-radius: 7.72vh;
      color: #fff;
      background: #4EB9FF;
      margin-right: .76vh;
      &.time {
        font-size: 28rpx;
      }
    }
  }
  .link {
    width: 500rpx;
    color: #4EB9FF;
    font-size: 22rpx;
    margin-top: 8rpx;
    &_item {
      display: inline;
    }
  }
  .img {
    &_loc { width: 118rpx; height: 118rpx; }
  }
}
</style>
