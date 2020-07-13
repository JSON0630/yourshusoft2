<template>
  <div class="AccountLogin">
    <img class="img_loc" src="/static/resources/login/loc.png" />
    <div class="user_login">用户登录</div>
    <div class="form_item">
      <div class="label">
        <img class="img_user" src="/static/resources/login/user.png" alt="">
      </div>
      <input v-model="keys.loginName" class="input" type="text" placeholder="请输入账号">
    </div>
    <div class="form_item">
      <div class="label">
        <img class="img_eye" src="/static/resources/login/eye.png" alt="">
      </div>
      <input v-model="keys.password" class="input" type="text" placeholder="请输入密码">
    </div>
    <div class="link">
      <navigator class="link_item" url="/pages/login/phone/main">手机验证码登录</navigator>
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
      loginName: '',
      password: ''
    }
  }),
  methods: {
    ...mapMutations(['update']),
    async login () {
      const { loginName, password } = this.keys
      if (!loginName) { return wx.showToast({ title: '请输入账号', icon: 'none' }) }
      if (!password) { return wx.showToast({ title: '请输入密码', icon: 'none' }) }
      const { success, data, msg } = await this.$http.userMobileLogin({loginName, password})
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
.AccountLogin {
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
      width: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;
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
  .login {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    background: #4EB9FF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 42rpx
  }
  .img {
    &_loc { width: 118rpx; height: 118rpx; }
    &_login { width: 36rpx; height: 35rpx; }
    &_user { width: 72rpx; height: 72rpx; }
    &_eye { width: 38rpx; height: 30rpx; }
  }
}
</style>
