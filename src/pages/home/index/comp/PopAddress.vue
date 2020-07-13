<template>
  <div class="PopAddress">
    <div class="location" @click="handlePos">
      <div v-if="time>0">{{ time }}s</div>
      <img v-else class="img_location" src="/static/resources/home/location.png" alt="">
    </div>
    <div class="address">
      <div class="flex-1">{{ recordLast.address }}</div>
      <div class="btn daohang" @click="$emit('daohang')">
        <img class="img_daohang" src="/static/resources/home/daohang.png">
        <div>导航</div>
      </div>
    </div>
    <div class="btn track" @click="goTrack">
      <img class="img_daohang" src="/static/resources/home/track.png">
      <div>轨迹</div>
    </div>
    <div class="more_info">
      <div class="flex">
        <div class="info_item">
          <div>时间：{{ recordLast.date }}</div>
          <div>通讯：{{ recordLast.activityTime }}</div>
        </div>
        <div>
          <div>信号：{{ recordLast.signal }}</div>
          <div>卫星：{{ recordLast.satellite}}</div>
        </div>
        <div class="battery_wrap">
          <div class="electricity">
            <img src="/static/resources/home/e.png" alt="">
            <div class="empty" :style="{width: (100 - recordLast.electricity) * 82 / 100 + '%'}"></div>
          </div>
          <div class="percent">{{ recordLast.electricity }}%</div>
        </div>
      </div>
      <div class="flex mt-8">
        <div class="info_item">
          <div>速度：{{ recordLast.speed }}</div>
          <div>经度：{{ recordLast.lng }}</div>
          <div>纬度：{{ recordLast.lat }}</div>
        </div>
        <div>
          <div>模式：{{ recordLast.type }}</div>
          <div>海拔：{{ recordLast.altitude }}</div>
          <div>温度：{{ recordLast.temperature || '无' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import { H5 } from '@/global/constants'

export default {
  props: {
    recordLast: Object
  },
  data: () => ({
    showMore: false,
    /** 倒计时 */
    time: 0
  }),
  methods: {
    /** 手动定位 */
    async handlePos () {
      this.$emit('refresh')
      if (this.time > 0) return
      const { imei } = this.recordLast
      const { success, msg } = await this.$http.deviceRefreshGps({imei})
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      wx.showToast({ title: '手动定位已下发，位置即将更新', icon: 'none' })
      this.initTimer()
    },
    goTrack() {
      const { imei } = this.recordLast
      console.log(H5.getTrackPath(imei))
      wx.navigateTo({
        url: H5.getTrackPath(imei)
      })
    },
    initTimer () {
      this.time = 30
      const timer = setInterval(() => {
        if (this.time > 0) {
          this.time--
        } else {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.PopAddress {
  width: 720rpx;
  position: absolute;
  bottom: 20rpx;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 6rpx #ccc;
  background: #44b38a;
  color: #fff;
  padding: 10rpx 32rpx;
  border-radius: 20rpx;
  .location {
    position: absolute;
    right: 0;
    top: -100rpx;
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 6rpx #ccc;
    border-radius: 50%;
    background: #fff;
    font-size: 24rpx;
  }
  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    width: 100%;
  }
  .btn {
    width: 140rpx;
    height: 50rpx;
    background: #ff9765;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30rpx;
    font-size: 20rpx;
    &.track {
      position: absolute;
      right: 32rpx;
      top: 96rpx;
    }
  }
  .more_info {
    position: relative;
    margin-top: 12rpx;
    font-size: 24rpx;
    width: 100%;
    overflow: hidden;
    .info_item {
      width: 50%;
    }
    .battery_wrap {
      position: absolute;
      right: 10rpx;
      bottom: 0;
      .electricity {
        position: relative;
        width: 70rpx;
        height: 40rpx;
        img {
          width: 100%;
          height: 100%;
        }
        .empty {
          position: absolute;
          background: #44b38a;
          right: 8rpx;
          height: 33rpx;
          top: 5rpx;
          border-radius: 0 6rpx 6rpx 0;
        }
      }
    }
  }
  .more {
    display: flex;
    font-size: 20rpx;
    align-items: center;
    width: 100%;
    margin-top: 12rpx;
  }
  .img {
    &_daohang { width: 23rpx; height: 33rpx; margin-right: 10rpx; }
    &_track { width: 28rpx; height: 36rpx; margin-right: 10rpx; }
    &_zhankai { width: 18rpx; height: 18rpx; margin-right: 17rpx; }
    &_location { width: 42rpx; height: 41rpx; }
  }
}
</style>
