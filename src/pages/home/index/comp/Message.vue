<template>
  <div class="Message" :class="{close}">
    <div class="short" v-if="close" @click="goMsg">
      <img class="img_message" src="/static/resources/home/message.png" alt="">
      <div>消息</div>
    </div>
    <div class="long" v-else>
      <img class="img_message" src="/static/resources/home/message.png" @click="goMsg">
      <div class="flex-1" @click="goMsg">您有{{unreadCount}}条未读消息</div>
      <img class="img_close" src="/static/resources/home/close.png" @click="$emit('close')">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    unreadCount: Number
  },
  computed: {
    close () {
      return this.unreadCount === 0
    }
  },
  methods:{
    goMsg () {
      wx.navigateTo({url: '/pages/home/message/main'})
    }
  }
}
</script>

<style lang="less">
.Message {
  width: 720rpx;
  height: 5.2vh;
  position: absolute;
  top: 12vh;
  z-index: 1;
  background: #fff;
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  box-shadow: 0 0 6rpx #ccc;
  color: #999;
  font-size: 24rpx;
  transition: all .3s ease;
  overflow: hidden;
  white-space: nowrap;
  &.close {
    left: 17rpx;
    border-radius: 14rpx;
    height: 90rpx;
    width: 72rpx;
  }
  .long {
    display: flex;
    align-items: center;
    width: 100%;
    .img_message {
      margin-left: 35rpx;
      margin-right: 32rpx;
    }
  }
  .short {
    font-size: 20rpx;
    text-align: center;
    width: 100%;
  }
  .img {
    &_message { width: 29rpx; height: 28rpx; }
    &_close { width: 36rpx; height: 37rpx; margin-right: 20rpx; }
  }
}
</style>
