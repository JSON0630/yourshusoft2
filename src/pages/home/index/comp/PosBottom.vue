<template>
  <div class="PosBottom">
    <navigator url="/pages/setting/device/setting/main" class="bottom_item" hover-class="none">
      <img class="img_setting" src="/static/resources/home/setting.png" alt="">
      <div>设置</div>
    </navigator>
    <div @click="goDingwei" class="pos_wrap">
      <img class="img_pos" src="/static/resources/home/pos.png" alt="">
    </div>
    <div @click="goTrack" class="bottom_item">
      <img class="img_track" src="/static/resources/home/track.png" alt="">
      <div>轨迹</div>
    </div>
  </div>
</template>

<script>
import { H5 } from '@/global/constants'

export default {
  props: {
    imei: String,
    name: String
  },
  methods: {
    goTrack() {
      wx.navigateTo({
        url: H5.getTrackPath(this.imei)
      })
    },
    /** 定位 */
    goDingwei () {
      wx.navigateTo({
        url: H5.getPosPath(this.imei, this.name)
      })
    }
  }
}
</script>

<style lang="less">
.PosBottom {
  width: 468rpx;
  height: 7.8vh;
  position: absolute;
  bottom: 2vh;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 0 6rpx #ccc;
  border-radius: 60rpx;
  .pos_wrap {
    background: #fff;
    border-radius: 50%;
    width: 132rpx;
    height: 132rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bottom_item {
    font-size: 26rpx;
    color: #666;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  .img {
    &_setting { width: 41rpx; height: 42rpx; }
    &_pos { width: 116rpx; height: 116rpx; }
    &_track { width: 41rpx; height: 39rpx; }
  }
}
</style>
