<template>
  <block>
    <map
      id="map"
      :enable-satellite="mapType===MAP_TYPE.satellite"
      :markers="markers"
      :scale="scale"
      style="width: 100%; height: 100vh;"
    />
    <div class="HomeIndex">
      <TopSearch
        :deviceList="deviceList"
        :currentDevice="currentDevice"
        @deviceChange="handeDeviceChange"
      />
      <Message :unreadCount="unreadCount" @close="unreadCount=0"/>
      <MapChoose :isTop="unreadCount===0" :mapType="mapType" @change="handleMapTypeChange"/>
      <PopAddress v-if="recordLast.imei" :currentDevice="currentDevice" :recordLast="recordLast" @refresh="handleRefresh" @shebei = "handleshebei" @daohang="handleDaohang"/>
    </div>
  </block>
</template>

<script>
import { mapMutations } from 'vuex'
import TopSearch from './comp/TopSearch'
import Message from './comp/Message'
import MapChoose from './comp/MapChoose'
import PopAddress from './comp/PopAddress'
import { MAP_TYPE, H5 } from '@/global/constants'
import { WSCoordinate } from '@/utils/WSCoordinate'

let map = null
export default {
  components: {
    TopSearch,
    Message,
    MapChoose,
    PopAddress
  },
  data: () => ({
    currentDevice: {},
    recordLast: { imei: '', lng: '', lat: '' },
    deviceList: [],
    unreadCount: 0,
    latitude:'',
    longitude:'',
    scale:17,
    mapType: MAP_TYPE.standard
  }),
  computed: {
    MAP_TYPE () { return MAP_TYPE },
    markers () {
      console.log(333, this.longitude,this.latitude)
      console.log(12345,this.currentDevice.name ,this.currentDevice.babyName )
      console.log(12345,this.currentDevice)
      return [{
        id:1,
        iconPath: '/static/resources/home/point.png',
        longitude: this.recordLast.lng,
        latitude: this.recordLast.lat,
        width: 34,
        height: 40,
        title:this.currentDevice.name || this.currentDevice.babyName,
        callout: {
          content:this.currentDevice.name || this.currentDevice.babyName ,
          display:'ALWAYS',
          anchorX: 0,
          anchorY: 0,
          bgColor: '#44b38a',
          borderRadius: 20,
          padding: 10,
          textAlign:'center',
          color: '#ffffff'
        }
      }
      ,{
        id: 2,
        iconPath: '/static/resources/home/point.gif',
        longitude: this.longitude,
        latitude: this.latitude,
        width: 30,
        height: 30,
        // label: {
        //   content:this.currentDevice.name || this.currentDevice.babyName ,
        //   anchorX: -45,
        //   anchorY: -80,
        //   bgColor: '#44b38a',
        //   borderRadius: 20,
        //   padding: 10,
        //   color: '#fff'
        // }
      }
      ]
    }
  },
  onLoad(options){
    // console.log(444,this.$set())
    this.recordLast = { imei: '', lng: '', lat: '' }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#44b38a',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    map = wx.createMapContext('map')
    console.log('map:',map)
    const { daohang } = options
    if (daohang) {
      this.handleDaohang(JSON.parse(daohang))
    } else {
      this.deviceListSimple()
      this.noticeUnreadCount()
    }
  },
  onShow(){
    this.recordLast = { imei: '', lng: '', lat: '' }
     wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#44b38a',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    map = wx.createMapContext('map')
    const { daohang } = ''
    if (daohang) {
      this.handleDaohang(JSON.parse(daohang))
    } else {
      this.deviceListSimple()
      this.noticeUnreadCount()
    }
  },
  methods: {
    ...mapMutations(['update']),
    /** 查询设备，默认选中第一个 */
    async deviceListSimple () {
      wx.showLoading({ title: '拉取设备中' })
      const { success, data, msg } = await this.$http.deviceListSimple()
      if (!success) { return wx.showToast({ title: msg || '请求失败', icon: 'none' }) }
      if (!Array.isArray(data)) { return wx.showToast({ title: '请求失败', icon: 'none' }) }
      if (data.length > 0) {
        // console.log(this.$store.state.imei,data[0])
        var evData = data.filter((ev)=>{
          return ev.imei == this.$store.state.imei
        })
        this.currentDevice = this.$store.state.imei?evData[0]:data[0]
        this.handeDeviceChange(this.$store.state.imei?evData[0]:data[0])
        this.deviceList = Object.freeze(data)
      } else {
        console.log(333)
        wx.showToast({ title: '无设备', icon: 'none' })
        this.handeDeviceChange({})
        this.update({imei: data.imei}) // 设备列表无数据时清楚缓存数据
        this.deviceList = []
      }
      let that = this
    wx.getLocation({ 
      type: 'gcj02', 
      success(res){
        console.log(233,res)
        that.latitude = res.latitude
        that.longitude = res.longitude
      },
      fail(res){
        console.log(133,res)
        wx.getSetting({
          success: (res) => {
            let authSetting = res.authSetting
            if (authSetting['scope.userLocation']) {
              // 已授权
            } else {
              wx.showModal({
                title: '您未开启地理位置授权',
                content: '你的位置信息将用于小程序位置接口的效果展示',
                success: res => {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          }
        })        
      }
    })
      wx.hideLoading()
    },
    /** 搜索 - 选择设备 */
    handeDeviceChange (device) {
      this.currentDevice = device
      this.update({imei: device.imei}) 
      this.trackRecordLast(device.imei)
    },
    /** 未读消息 */
    async noticeUnreadCount () {
      const { success, data } = await this.$http.noticeUnreadCount()
      if (success) { this.unreadCount = data }
    },
    /** 设备信息 */
    async trackRecordLast (imei) {
      console.log(imei)
      const { success, data, msg } = await this.$http.trackRecordLast({imei})
      console.log(data.address)
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      this.recordLast.imei = ''
      if (data) {
        const { longitude, latitude } = WSCoordinate.transformFromWGSToGCJ(data.lat,data.lng)
        this.recordLast = { ...data, lat: latitude, lng: longitude }
        map.moveToLocation({longitude, latitude})
        this.update({imei: data.imei})
      } else {
        this.getLocation(({latitude, longitude}) => {
          this.recordLast = { imei: '', lng: longitude, lat: latitude }
        })
        this.update({imei: ''})
      }
      console.log(this.recordLast)
    },
    /** 手动定位 */
    async handleRefresh () {
      const { lat, lng } = this.recordLast
      map.moveToLocation({ longitude: lng, latitude: lat })
    },
    /** 导航 */
    handleDaohang (daohang) {
      console.log(daohang)
      const { address, lng, lat } = this.recordLast
      const { name, babyName } = this.currentDevice
      this.getLocation(res => {
        wx.openLocation(daohang || {
          latitude: lat,
          longitude: lng,
          name: name || babyName,
          address
        })
      })
    },
    handleshebei(){
      let that = this
      wx.getLocation({ 
      type: 'gcj02', 
      success:(res)=>{
        console.log(233,res)
        that.latitude = res.latitude
        that.longitude = res.longitude
      //  移动标注点
        map.translateMarker({
          markerId: 2,
          autoRotate: true,
          duration: 1000,
          destination: {
            latitude: res.latitude,
            longitude: res.longitude,
            //  latitude: 22.52291,
            // longitude: 100.05454

          },
          animationEnd() {
            console.log('动画结束')
          }
        })
        console.log(this.markers)
      },
      fail(res){
        console.log(133,res)
        wx.getSetting({
          success: (res) => {
            let authSetting = res.authSetting
            if (authSetting['scope.userLocation']) {
              // 已授权
            } else {
              wx.showModal({
                title: '您未开启地理位置授权',
                content: '你的位置信息将用于小程序位置接口的效果展示',
                success: res => {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          }
        })        
      }
    })
    },
    handleMapTypeChange (type) {
      this.mapType = type
    },
    getLocation (success) {
      console.log('suss',success)
      wx.getLocation({ type: 'gcj02', success })
    }
  }
};

</script>

<style lang="less">
.HomeIndex {
  display: flex;
  justify-content: center;
}
</style>
