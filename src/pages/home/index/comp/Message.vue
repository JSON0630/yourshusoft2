<template>
  <div class="Message" :class="{close}">
    <!-- <div class="short" v-if="close" @click="goMsg"> -->
    <div class="short" @click="goMsg">

      <img class="img_message" src="/static/resources/home/message.png" alt="">
      <span v-if="unreadCount >0" class="point_img_open"></span>
      <span  v-else class="point_img_close"></span>
      <div >{{unreadCount}}条未读消息</div>
    </div>
    <!-- <div class="long" v-else>
      <img class="img_message" src="/static/resources/home/message.png" @click="goMsg">
      <div class="flex-1" @click="goMsg">您有{{unreadCount}}条未读消息</div>
      <div class="icon_close" @click="$emit('close')">&times;</div>
    </div> -->
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
  // width: 720rpx;
  height: 5.2vh;
  position: absolute;
  top: 108rpx;
  left: 20rpx;
  z-index: 1;
  background: #fff;
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  box-shadow: 0 0 6rpx #ccc;
  color: #44b38a;
  font-size: 24rpx;
  transition: all .3s ease;
  overflow: hidden;
  white-space: nowrap;
  padding: 0rpx 20rpx;
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
  .point_img_close{
    display: inline-block;
    position: absolute;
    top: 15rpx;
    height: 10rpx;
    width: 10rpx;
    border-radius: 100%;
    background: #ccc;
  }
  .point_img_open{
    display: inline-block;
    position: absolute;
    top: 15rpx;
    height: 10rpx;
    width: 10rpx;
    border-radius: 100%;
    background: red;
  }
  .short {
    font-size: 20rpx;
    text-align: center;
    // width: 100%;
    >div{
      margin-left: 20rpx;
      display: inline-block;
    }
  }
  .img {
    &_message { width: 29rpx; height: 28rpx; }
  }
  .icon_close {
    font-size: 36rpx;
    padding: 0 20rpx;
    margin-bottom: 10rpx;
  }
}
</style>
