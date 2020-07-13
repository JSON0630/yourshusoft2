<template>
  <div class="HomeTrack">
    <map
      id="map"
      :polyline="polyline"
      :include-points="points"
      :markers="markers"
       scale="17"
      style="width: 100%; height: 100vh;"
    />
    <SearchOptions :date="date" @submit="trackRecordList"/>
    <div class="bottom">
      <!-- <div class="media_btn">
        <img @click="handlePrev" class="img_m_left" src="/static/resources/home/m_left.png" alt="">
        <img v-if="isPlay" @click="handlePause" class="img_m_pause" src="/static/resources/home/m_pause.png" alt="">
        <div v-else @click="handlePlay" class="triangle"/>
        <img @click="handleNext" class="img_m_right" src="/static/resources/home/m_right.png" alt="">
        <button class="btn" @click="changeSpeed">{{ label }}</button>
      </div> -->
      <div class="info">
        <div class="address">
          <div class="text">{{ currentPoint.address }}</div>
          <div class="time">{{ currentPoint.date }}   定位模式:{{ currentPoint.type }}</div>
        </div>
        <div class="all_btn" @click="goTrackList">
          <img class="img_all_track" src="/static/resources/home/all_track.png" alt="">
          <div class="text">所有轨迹</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchOptions from './comp/SearchOptions'
import { formatTime } from '@/utils'
import { WSCoordinate } from '@/utils/WSCoordinate'

let map = null
let timer = null
export default {
  components: { SearchOptions },
  data: () => ({
    date: '',
    deviceImei: '',
    points: [],
    currentPointIndex: 0,
    startTime: '',
    endTime: '',
    speedIndex: 2,
    isPlay: false
  }),
  computed: {
    ...mapState(['imei']),
    speeds () {
      return [
        { label: '快', div: 100 },
        { label: '中', div: 50 },
        { label: '慢', div: 20 }
      ]
    },
    label () {
      return this.speeds[this.speedIndex].label
    },
    div () {
      return this.speeds[this.speedIndex].div
    },
    speed () {
      if (this.points.length) {
        const point = this.points[this.currentPointIndex] || {}
        const nextPoint = this.points[this.currentPointIndex + 1] || {}
        return (new Date(nextPoint.date).getTime() - new Date(point.date).getTime()) / this.div
      } else {
        return 1000
      }
    },
    currentPoint () {
      const i = this.currentPointIndex > 0 ? this.currentPointIndex - 1 : 0
      return this.points[i] || {}
    },
    polyline () {
      return [{
        points: this.points.slice(0, this.currentPointIndex),
        color: '#1ca43c',
        width: 4,
        arrowLine: true
      }, {
        points: this.points,
        color: '#4e71f25c',
        width: 4,
      }]
    },
    markers () {
      return [{
        iconPath: '/static/resources/home/point_now.gif',
        ...this.currentPoint,
        id: 0,
        width: 40,
        height: 48
      }]
    }
  },
  onLoad (options) {
    map = wx.createMapContext('map')
    this.deviceImei = options.imei || this.imei
    this.trackRecordList({
      dataTypeList: [1, 2, 3],
      rectify: false,
      date: formatTime(Date.now(), 'yyyy-MM-dd')
    })
  },
  methods: {
    async trackRecordList (params) {
      this.date = params.date
      this.startTime = formatTime(params.date, 'yyyy年MM月dd日 ') + '00:00:00'
      this.endTime = formatTime(params.date, 'yyyy年MM月dd日 ') + '23:59:59'
      const { success, data, msg } = await this.$http.trackRecordList({
        imei: this.deviceImei,
        startTime: this.startTime,
        endTime: this.endTime,
        ...params
      })
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      if (!data.length) { return wx.showToast({ title: '无记录', icon: 'none' }) }
      this.currentPointIndex = data.length - 1
      this.points = Object.freeze(data.map(pos => ({
        latitude: WSCoordinate.transformFromWGSToGCJ(pos.lat, pos.lng).latitude, 
        longitude: WSCoordinate.transformFromWGSToGCJ(pos.lat, pos.lng).longitude, 
        ...pos})))
    },
    goTrackList () {
      wx.navigateTo({
        url: `/pages/home/trackList/main?imei=${this.deviceImei}&startTime=${this.startTime}&endTime=${this.endTime}`
      })
    },
    changeSpeed () {
      const that = this
      wx.showActionSheet({
        itemList: that.speeds.map(v => v.label),
        success (res) {
          that.speedIndex = res.tapIndex
        }
      })
    },
    handlePrev () {
      this.handlePause()
      if (this.currentPointIndex > 0) {
        this.currentPointIndex--
      }
    },
    handlePause () {
      this.isPlay = false
      clearInterval(timer)
    },
    handlePlay () {
      this.isPlay = true
      if (this.currentPointIndex === this.points.length - 1) {
        this.currentPointIndex = 0
      }
      timer = setInterval(() => {
        if (this.currentPointIndex < this.points.length - 1) {
          this.currentPointIndex++
          map.moveToLocation(this.currentPoint)
        } else {
          this.handlePause()
        }
      }, this.speed)
    },
    handleNext () {
      this.handlePause()
      if (this.currentPointIndex < this.points.length - 1) {
        this.currentPointIndex++
      }
    }
  }
}
</script>

<style lang="less">
.HomeTrack {
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(256, 256, 256, .8);
    box-shadow: 0 0 6rpx #ccc;
    .media_btn {
      display: flex;
      align-items: center;
      height: 120rpx;
      border-bottom: 1rpx solid #ccc;
      img {
        margin-left: 15vw;
      }
      .btn {
        color: #fff;
        background: #9B9B9B;
        width: 108rpx;
        height: 62rpx;
        line-height: 62rpx;
        font-size: 24rpx;
        margin-left: 20vw;
      }
    }
  }
  .info {
    display: flex;
    align-items: center;
    height: 140rpx;
    .address {
      flex: 1;
      padding: 0 40rpx;
      .text {
        font-size: 28rpx;
        color: #666;
      }
      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
    .all_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-left: 2px dashed #ccc;
      height: 100rpx;
      padding: 0 30rpx;
      .text {
        font-size: 28rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }
  .triangle {
    border-width: 13rpx 20rpx;
    border-color: transparent transparent transparent #9B9B9B;
    border-style: solid;
    height: 0;
    width: 0;
    margin-left: 15vw;
  }
  .img {
    &_m_left { width: 25rpx; height: 25rpx; }
    &_m_pause { width: 25rpx; height: 29rpx; margin-right: 8rpx; }
    &_m_right { width: 25rpx; height: 25rpx; }
    &_all_track { width: 46rpx; height: 39rpx; }
  }
}
</style>
