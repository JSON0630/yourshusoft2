<template>
  <div class="Track">
    <div id="containerTrack"></div>
    <SearchOptions :keys="keys" @submit="getList"/>
    <div class="bottom" v-if="list.length">
      <div class="media_btn">
        <img @click="prev" class="img_m_left" src="@/assets/img/m_left.png" alt="">
        <img v-if="isPlay" @click="pause" class="img_m_pause" src="@/assets/img/m_pause.png" alt="">
        <div v-else @click="start" class="triangle"></div>
        <img @click="next" class="img_m_right" src="@/assets/img/m_right.png" alt="">
        <select class="btn" v-model="speed">
          <option :value="10000">快</option>
          <option :value="5000">中</option>
          <option :value="1000">慢</option>
        </select>
      </div>
      <div class="info">
        <div class="address">
          <div class="text">{{ currentPoint.address }}</div>
          <div class="time">{{ currentPoint.date }}   定位模式:{{ currentPoint.type }}</div>
        </div>
        <div class="all_btn" @click="goTrackList">
          <img class="img_all_track" src="@/assets/img/all_track.png" alt="">
          <div class="text">所有轨迹</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import SearchOptions from './comp/SearchOptions.vue'
import { dateFormat } from '@/utils'
import WSCoordinate from '@/plugins/WSCoordinate.ts'

var emptyLineStyle = {
      lineWidth: 0,
      fillStyle: null,
      strokeStyle: null,
      borderStyle: null
  }
let timer = null
let map = null
let markers = null
var navg = null
var pathSimplifierIns = null
var AMap = window.AMap
@Component({ components: {SearchOptions} })
export default class extends Vue {
  private keys = {
    date: dateFormat(Date.now(), 'yyyy-MM-dd'),
    startTime: '00:00:00',
    endTime: '23:59:59',
    dataTypeList: [1, 2, 3],
    rectify: false
  }
  private path = []
  private list = []
  private currentIndex = 0
  private speed = 5000
  private isPlay = false
  private showSelectSpeed = false
  get currentPoint() {
    return this.list[this.currentIndex] || {}
  }
  @Watch('speed')
  onSpeedChange(speed) {
    navg.setSpeed(speed)
  }
  private mounted() {
    map = new AMap.Map('containerTrack', {resizeEnable: true})
    this.initPathSimplifier()
  }
  private initPathSimplifier() {
    const that = this
    window.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function (PathSimplifier, $, utils) {
      pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        map: map,
        getPath: function (pathData, pathIndex) {
          return pathData.path;
        },
        renderOptions: {
          renderAllPointsIfNumberBelow: 800,
          pathLineSelectedStyle: {
            lineWidth: 6,
            strokeStyle: 'rgba(108, 139, 252, .6)',
            borderWidth: 1,
            borderStyle: '#eeeeee',
          },
          keyPointOnSelectedPathLineStyle: {
            radius: 4,
            fillStyle: 'white',
            strokeStyle: 'rgb(32, 193, 52)',
            lineWidth: 1
          },
          pathNavigatorStyle: {
            initRotateDegree: 0,
            width: 16,
            height: 16,
            lineJoin: 'round',
            content: 'defaultPathNavigator',
            fillStyle: 'rgba(32, 193, 52, 1)',
            strokeStyle: '#eeeeee',
            lineWidth: 1,
            pathLinePassedStyle: {
              lineWidth: 5,
              strokeStyle: 'rgba(32, 193, 52, 1)',
              borderWidth: 1,
              borderStyle: '#eeeeee',
              dirArrowStyle: false
            }
          }
        }
      });
      that.getList(that.keys)
    })
  }
  getList(params) {
    console.log(this.$route.query.imei)
    const { token, imei } = this.$route.query
    fetch('https://api.youshusoft.com/gpsserver/api/track_record/list/v2', {
      method: "POST",
      mode: 'cors',
      headers: {
        'token': token as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...params,
        imei,
        startTime: params.date + ' ' + params.startTime,
        endTime: params.date + ' ' + params.endTime
      })
    }).then(response => response.json()).then(json => {
      const data = json.data.map(v => {
        const pos = WSCoordinate.transformFromWGSToGCJ(v.lat, v.lng)
        return { ...v, lng: pos.longitude, lat: pos.latitude }
      })
      this.list = Object.freeze(data)
      this.addMarker()
      if (this.list.length) {
        this.currentIndex = this.list.length - 1
        this.path = Object.freeze(data.map(v => [v.lng, v.lat]))
        pathSimplifierIns.setData([{path: this.path}])
        pathSimplifierIns.setSelectedPathIndex(0)
      } else {
        this.$toast('无轨迹记录')
        this.currentIndex = 0
        pathSimplifierIns.setData()
      }
    })
  }
  private prev () {
    if(navg && this.currentIndex > 0) {
      navg.pause()
      navg.moveToPoint(--this.currentIndex)
    }
  }
  private next () {
    if(navg && this.currentIndex < this.list.length - 1) {
      navg.pause()
      navg.moveToPoint(++this.currentIndex)
    }
  }
  private pause () {
    this.isPlay = false
    navg.pause()
  }
  private start () {
    console.log(this.speed)
    this.isPlay = true
    const endIdx = this.list.length - 1
    if (!navg) {
      navg = pathSimplifierIns.createPathNavigator(0, {speed: this.speed});
      navg.start()
    } else {
      navg.resume()
      navg.setSpeed(this.speed)
      if(this.currentIndex === endIdx) {
        navg.start(0)
      }
    }
    timer = setInterval(() => {
      var c = navg.getCursor()
      this.currentIndex = c.idx
      if (c.idx === endIdx) {
        clearInterval(timer)
        this.isPlay = false
      }
    }, 500);
  }
  private addMarker() {
    markers && map.remove(markers);
    const { length } = this.list
    if (!length) return
    const startPos = this.list[0]
    const endPos = this.list[length - 1]
    // 创建一个 Icon
    var startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 34),
        // 图标的取图地址
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(135, 40),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(-9, -3)
    });

    // 将 icon 传入 marker
    var startMarker = new AMap.Marker({
        position: new AMap.LngLat(startPos.lng,startPos.lat),
        icon: startIcon,
        offset: new AMap.Pixel(-13, -30)
    });

    // 创建一个 icon
    var endIcon = new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-95, -3)
    });

    // 将 icon 传入 marker
    var endMarker = new AMap.Marker({
        position: new AMap.LngLat(endPos.lng,endPos.lat),
        icon: endIcon,
        offset: new AMap.Pixel(-13, -30)
    });

    markers = [startMarker, endMarker]

    // 将 markers 添加到地图
    map.add(markers);
  }
  private goTrackList () {
    const { imei } = this.$route.query
    window.wx.miniProgram.navigateTo({
      url: `/pages/home/trackList/main?params=` + JSON.stringify({...this.keys, imei})
    })
    // window.wx.miniProgram.postMessage({ data: 'foo' })
  }
}
</script>

<style lang="less">
#containerTrack {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.Track {
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(256, 256, 256, .8);
    box-shadow: 0 0 6px #ccc;
    .media_btn {
      display: flex;
      align-items: center;
      height: 120px;
      border-bottom: 1px solid #ccc;
      img {
        margin-left: 15vw;
      }
      .btn {
        background: #9B9B9B;
        width: 98px;
        height: 52px;
        font-size: 24px;
        margin-left: 20vw;
        text-align: center;
        border-radius: 10px;
        outline: none;
      }
    }
  }
  .info {
    display: flex;
    align-items: center;
    height: 140px;
    .address {
      flex: 1;
      padding: 0 40px;
      .text {
        font-size: 28px;
        color: #666;
      }
      .time {
        font-size: 24px;
        color: #999;
        margin-top: 10px;
      }
    }
    .all_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-left: 2px dashed #ccc;
      height: 100px;
      padding: 0 30px;
      .text {
        font-size: 28px;
        color: #666;
        margin-top: 10px;
      }
    }
  }
  .triangle {
    border-width: 13px 20px;
    border-color: transparent transparent transparent #9B9B9B;
    border-style: solid;
    height: 0;
    width: 0;
    margin-left: 15vw; margin-right: -7px;
  }
  .img {
    &_m_left { width: 25px; height: 25px; }
    &_m_pause { width: 25px; height: 29px; margin-right: 8px; }
    &_m_right { width: 25px; height: 25px; }
    &_all_track { width: 46px; height: 39px; }
  }
}
</style>
