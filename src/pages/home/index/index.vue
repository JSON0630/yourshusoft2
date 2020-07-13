<template>
  <block>
    <map
      id="map"
      :enable-satellite="mapType===MAP_TYPE.satellite"
      :markers="markers"
      scale="17"
      style="width: 100%; height: 100vh;"
    />
    <div class="HomeIndex">
      <TopSearch
        :deviceList="deviceList"
        :currentDevice="currentDevice"
        @deviceChange="handeDeviceChange"
        @search="handleSearch"
      />
      <Message :unreadCount="unreadCount" @close="unreadCount=0"/>
      <MapChoose :isTop="unreadCount===0" :mapType="mapType" @change="handleMapTypeChange"/>
      <PopAddress v-if="recordLast.imei" :recordLast="recordLast" @refresh="handleRefresh" @daohang="handleDaohang"/>
      <PosBottom v-if="recordLast.imei" :imei="recordLast.imei" :name="currentDevice.name || currentDevice.babyName"/>
    </div>
  </block>
</template>

<script>
import { mapMutations } from 'vuex'
import TopSearch from './comp/TopSearch'
import Message from './comp/Message'
import MapChoose from './comp/MapChoose'
import PopAddress from './comp/PopAddress'
import PosBottom from './comp/PosBottom'
import { MAP_TYPE, H5 } from '@/global/constants'
import { WSCoordinate } from '@/utils/WSCoordinate'

let map = null
export default {
  components: {
    TopSearch,
    Message,
    MapChoose,
    PopAddress,
    PosBottom
  },
  data: () => ({
    currentDevice: {},
    recordLast: { imei: '', lng: '', lat: '' },
    deviceList: [],
    unreadCount: 0,
    mapType: MAP_TYPE.standard
  }),
  computed: {
    MAP_TYPE () { return MAP_TYPE },
    markers () {
      return [{
        iconPath: '/static/resources/home/point.gif',
        longitude: this.recordLast.lng,
        latitude: this.recordLast.lat,
        width: 30,
        height: 30
      }]
    }
  },
  onLoad(options){
    map = wx.createMapContext('map')
    const { daohang } = options
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
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      if (data.length) {
        this.handeDeviceChange(data[0])
        this.deviceList = Object.freeze(data)
      } else {
        wx.showToast({ title: '无设备', icon: 'none' })
        this.handeDeviceChange({})
        this.deviceList = []
      }
      wx.hideLoading()
    },
    /** 搜索 - 选择设备 */
    handeDeviceChange (device) {
      this.currentDevice = device
      this.trackRecordLast(device.imei)
    },
    /** 未读消息 */
    async noticeUnreadCount () {
      const { success, data } = await this.$http.noticeUnreadCount()
      if (success) { this.unreadCount = data }
    },
    /** 设备信息 */
    async trackRecordLast (imei) {
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
    },
    /** 搜索 */
    async handleSearch (search) {
      const { success, data, msg } = await this.$http.deviceSearch({imei: search, val: 1})
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      this.deviceList = Object.freeze(data)
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
    handleMapTypeChange (type) {
      this.mapType = type
    },
    getLocation (success) {
      wx.getLocation({ type: 'gcj02', success })
    }
  }
};
</script>

<style lang="less">
.HomeIndex {
  background: rgb(103, 187, 103);
  display: flex;
  justify-content: center;
}
</style>
