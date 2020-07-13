<template>
  <div class="ThirdLogin">
    <div class="login" @click="$emit('login')">
      <img class="img_login" src="/static/resources/login/login.png">
    </div>
    <div class="bottom">
      <div class="top">第三方登录</div>
      <img class="img_weixin" src="/static/resources/login/weixin.png" @click="login"/>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['update']),
    login () {
      wx.login({
        success: async res => {
          const { success, data, msg } = await this.$http.userWxMiniappLogin({ code: res.code })
          if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
          wx.setStorageSync('USER_NAME', data.userName)
          wx.setStorageSync('TOKEN', data.token)
          wx.setStorageSync('CODE', res.code)
          wx.reLaunch({url: '/pages/home/index/main'})
        }
      })
      // 获取用户信息
      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting['scope.userInfo']) {
      //       wx.getUserInfo({
      //         success: res => {
      //           wx.navigateTo({url: '/pages/home/index/main'})
      //         }
      //       })
      //     }
      //   }
      // })
    }
  }
}
</script>

<style lang="less">
.ThirdLogin {
  margin-top: 42rpx;
  .login {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    background: #4EB9FF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  .bottom {
    text-align: center;
    margin-top: 50rpx;
  }
  .top {
    position: relative;
    color: #ccc;
    &::before,
    &::after {
      content: '';
      position: absolute;
      height: 0;
      width: 200rpx;
      border-top: 2rpx dashed #ccc;
      top: 20rpx;
    }
    &::before { right: 165rpx; }
    &::after { left: 165rpx; }
  }
  .img {
    &_login { width: 36rpx; height: 35rpx; }
    &_weixin { width: 72rpx; height: 72rpx; margin-top: 20rpx; }
  }
}
</style>
