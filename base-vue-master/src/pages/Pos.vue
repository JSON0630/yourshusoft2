<template>
  <div class="Pos">
    <div id="containerPos"></div>
    <div class="PopAddress">
      <div class="location my" @click="handlePosMy">
        <img class="img_phone" src="@/assets/img/phone.png" alt="">
      </div>
      <div class="location device" @click="handlePosDevice">
        <img class="img_location" src="@/assets/img/location.png" alt="">
      </div>
      <div class="address">
        <div class="flex-1" @click="showMore=!showMore">{{ recordLast.address }}</div>
        <img class="img_daohang" src="@/assets/img/daohang.png" @click="handleDaohang">
      </div>
      <div class="more_info" :class="{show: showMore}" @click="showMore=!showMore">
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
            <Electricity :electricity="recordLast.electricity" />
            <div class="percent">{{ recordLast.electricity }}%</div>
          </div>
        </div>
        <div class="flex mt-8">
          <div class="info_item">
            <div>速度：{{ recordLast.speed }}</div>
            <div>经度：{{ recordLast.lng }}</div>
            <div>温度：{{ recordLast.temperature || '无' }}</div>
          </div>
          <div>
            <div>模式：{{ recordLast.type }}</div>
            <div>纬度：{{ recordLast.lat }}</div>
            <div>海拔：{{ recordLast.altitude }}</div>
          </div>
        </div>
      </div>
      <div class="more" @click="showMore=!showMore">
        <img class="img_zhankai" src="@/assets/img/zhankai.png" alt="">
        <div>{{ showMore ? '收起信息' : '展开更多' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang=ts>
import { Component, Vue, Watch } from 'vue-property-decorator'
import Electricity from '../components/Electricity.vue'
import WSCoordinate from '@/plugins/WSCoordinate.ts'

interface IQuery {
  token: string
  imei: string
}
let map = null
let polyline = null
let geolocation = null
const AMap = window.AMap
@Component({components: {Electricity}})
export default class extends Vue {
  private showMore = false
  private recordLast = {}
  private myPosition = null
  private mounted() {
    map = new AMap.Map('containerPos', { zoom: 16 })
    this.trackRecordLast()
  }
  /** 设备信息 */
  private trackRecordLast () {
    const { token, imei } = this.$route.query
    fetch('https://api.youshusoft.com/gpsserver/api/track_record/last/v2', {
      method: "POST",
      mode: 'cors',
      headers: {
        'token': token as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imei: imei || '363620190804605',
      })
    }).then(response => response.json()).then(json => {
      const { data, msg } = json
      if (msg) { this.$toast(msg) }
      if (data) {
        const pos = WSCoordinate.transformFromWGSToGCJ(data.lat, data.lng)
        this.recordLast = Object.freeze({...data, lng: pos.longitude, lat: pos.latitude})
        this.initDeviceMarker(this.recordLast)
        this.initMyPosition()
      }
    })
  }
  private initMyPosition() {
    const that = this
    AMap.plugin('AMap.Geolocation', function() {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        zoomToAccuracy: true  //定位成功后是否自动调整地图视野到定位点
      })
      map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status,result){
        if(status=='complete'){
          const { position } = result
          console.log('-----', position)
          that.myPosition = position
          that.drawPolyline()
        }else{
          that.$toast('未获取到定位，请稍后重试')
          that.handlePosDevice()
        }
      })
    })
  }
  private initDeviceMarker(data) {
    var deviceIcon = new AMap.Icon({
        image: 'https://gps.suogong.net/gpstrackanimation/static/point.png',
        imageSize: new AMap.Size(60, 60)
    });
    var deviceMarker = new AMap.Marker({
        position: new AMap.LngLat(data.lng, data.lat),
        icon: deviceIcon,
        offset: new AMap.Pixel(-30, -30)
    });
    map.add([deviceMarker])
  }
  private handlePosMy() {
    const that = this
    geolocation.getCurrentPosition(function(status,result){
      if(status=='complete'){
        const { position } = result
        console.log('-----', position)
        that.myPosition = position
        that.drawPolyline()
        map.panTo(position)
        map.setZoom(20)
      }else{
        that.$toast('未获取到定位，请稍后重试')
      }
    })
  }
  private handlePosDevice() {
    const { lng, lat } = this.recordLast as any
    map.panTo([lng, lat])
    map.setZoom(20)
  }
  private drawPolyline() {
    const { lng, lat } = this.recordLast as any
    if (!this.myPosition || !lng) return
    if (polyline) map.remove(polyline)
    var path = [ this.myPosition, [lng, lat] ];

    polyline = new AMap.Polyline({
        path: path,
        strokeColor: "#3366FF", 
        strokeWeight: 2,
        // 折线样式还支持 'dashed'
        strokeStyle: "dashed",
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        zIndex: 50,
    })

    polyline.setMap(map)
    // 缩放地图到合适的视野级别
    map.setFitView([ polyline ])
  }
  private handleDaohang() {
    const { address, lng, lat } = this.recordLast as any
    window.wx.miniProgram.navigateTo({
      url: `/pages/home/index/main?daohang=` + JSON.stringify({
        name: this.$route.query.name,
        latitude: lat,
        longitude: lng,
        address
      })
    })
  }
}
</script>

<style lang="less">
#containerPos {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.Pos {
  .PopAddress {
    width: 96vw;
    position: fixed;
    left: 2vw;
    bottom: 20px;
    z-index: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 0 6px #ccc;
    background: rgba(255, 255, 255, .8);
    color: #666;
    padding: 20px 36px;
    border-radius: 20px;
    .location {
      position: absolute;
      right: 0;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 6px #ccc;
      border-radius: 50%;
      background: #fff;
      font-size: 24px;
      &.device {
        top: -100px;
      }
      &.my {
        top: -200px;
      }
    }
    .address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
      width: 100%;
    }
    .more_info {
      position: relative;
      margin-top: 12px;
      font-size: 24px;
      width: 100%;
      height: 0;
      color: #999;
      overflow: hidden;
      transition: height .3s ease;
      &.show {
        height: 180px;
      }
      .info_item {
        width: 50%;
      }
      .battery_wrap {
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
    .more {
      display: flex;
      font-size: 20px;
      align-items: center;
      width: 100%;
      margin-top: 12px;
    }
    .img {
      &_daohang { width: 110px; height: 47px; margin-left: 30px; }
      &_zhankai { width: 18px; height: 18px; margin-right: 17px; }
      &_location { width: 42px; height: 41px; }
      &_phone { width: 29px; height: 45px; }
    }
  }
}
</style>
