<template>
  <block>
    <div class="TopSearch" v-if="!showSelect">
      <!-- url="/pages/setting/index/main" -->
      <div @click="personClick" >
        <img class="img_avatar" :class="{online: device.online}" :src="device.avatar" @error="handleAvatarError"/>
      </div>
      <div class="search" @click="showSelect=true">
        <div class="label">名称</div>
        <div class="name ellipsis">{{ device.name }}</div>
        <img class="img_arrow_down" src="/static/resources/home/arrow_down.png" alt="">
      </div>
      <!-- <img class="img_question" src="/static/resources/home/question.png" alt=""> -->
      <!-- <view style="background-color: #ff9765"> -->
        <img class="img_scan" src="/static/resources/home/scan.png" @click="scanCode">
      <!-- </view> -->
    </div>
    <div class="TopSearch" v-else>
      <input :value="device.name" @input="handleInput" class="flex-1" type="text" placeholder="请输入设备名称或imei号">
      <div class="cancel" @click="showSelect=false">取消</div>
    </div>
    <div class="DeviceList" :class="{open: showSelect}">
      <div class="item"
        v-for="(x, i) in computedList"
        :key="i"
        @click="onDeviceChange(x)"
        :class="{active: device.imei === x.imei}"
      >
        <div class="flex-align-center">
          <img class="img_device" :src="x.avatar || x.babyAvatar" @error="handleListImgError(x)">
          <div class="name">{{ x.name || x.babyName }}</div>
        </div>
        <div class="radius" :class="{online: x.online}"></div>
      </div>
      <div v-if="!computedList.length && list.length < deviceList.length" @click="handleMore" class="item more">更多</div>
    </div>
  </block>
</template>

<script>
import { debounce } from '@/utils'
import { mapMutations } from 'vuex'

export default {
  props: {
    currentDevice: Object,
    deviceList: Array
  },
  data(){
    return {
      pageNum: 20,
      list: [],
      searchList: [],
      device: {},
      showSelect: false
    }
  },
  computed: {
    computedList () {
      return this.searchList.length>0 ? this.searchList : this.list
    }
  },
  watch: {
    currentDevice (device) {
      console.log(device,'*****')
      this.device = {
        imei: device.imei,
        avatar: device.avatar || device.babyAvatar,
        name: device.name || device.babyName,
        ...device
      }
    },
    deviceList (list) {
      console.log(list,'****')
      this.list = list.slice(0, 100)
    }
  },
  methods: {
    ...mapMutations(['update']),
    handleMore () {
      this.list = [...this.list, ...this.deviceList.slice(this.pageNum, this.pageNum + 100)]
      this.pageNum = this.pageNum + 100
    },
    handleListImgError (x) {
      x.avatar = '/static/resources/login/user.png'
    },
    handleAvatarError () {
      this.device.avatar = '/static/resources/login/user.png'
    },
    personClick(){
      const { imei } = this.device
      const that = this
      wx.showActionSheet({
        itemList: [ '设备管理','流量续费','退出','客服热线：0898-68928360'],
        success (res) {

          if(!imei && res.tapIndex !== 2 && res.tapIndex !== 3){
            return  wx.showToast({ title: '请先绑定设备', icon: 'none' })
          }
          if(res.tapIndex == 0){
            wx.navigateTo({url: '/pages/setting/device/manage/main'})
          }else if(res.tapIndex == 1){
            wx.navigateTo({url: `/pages/setting/device/renew/main?imei=${imei}`})
          // }else if(res.tapIndex == 2){
            // wx.navigateTo({url: `/pages/setting/device/setting/main?imei=${imei}`})
          }else if(res.tapIndex == 2){
            // wx.navigateTo({url: `/pages/setting/index/main?imei=${imei}`})
            that.exit()
          }else if(res.tapIndex == 3){
            wx.makePhoneCall({
              phoneNumber: '0898-68928360',
              success: (result) => {
              },
              fail: () => {},
              complete: () => {}
            })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },
    exit(){
      wx.showModal({
        title: '',
        content: '请确认是否退出登录？',
        success : (res) =>  {
            if(res.confirm) {
                console.log('用户点击确定')
                this.logOut()
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
        }
      })
    },
    async logOut(){
        let result = await this.$http.userLogout()
        wx.showToast({
            title: result.msg,
            icon: 'err',
            duration: 2000
        })
        if(result.code == 0){
            this.disabled = false
            wx.clearStorage()
            this.update({imei: ''}) // 清楚缓存数据
            wx.reLaunch({url: '/pages/login/phone/main'})
        }
    },
    scanCode () {
      const that =this
      wx.showActionSheet({
        itemList: ['扫码添加','手动添加'],
        success (res) {
          if(res.tapIndex == 1){
            wx.navigateTo({url: '/pages/home/adddevice/main'})
          }else if(res.tapIndex == 0){
              wx.scanCode({
              async success (result) {
                console.log(result.result.split('?'))
                if(result.result.split('?').length >1){
                  wx.navigateTo({url: `/pages/home/adddevice/main?imei=${result.result.split('?')[1].split('=')[1]}`})
                }else{
                  wx.navigateTo({url: `/pages/home/adddevice/main?imei=${result.result}`})
                
                }
                 
              }
          })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
     
    },
    onDeviceChange (device) {
      this.$emit('deviceChange', device)
      setTimeout(() => {
        this.showSelect = false
      }, 300)
    },
    handleInput: debounce(function (e){
      console.log('---', e.target.value)
      const search = e.target.value
      if (search) {
        this.searchList = this.deviceList.filter(v => v.imei.includes(search) || v.name.includes(search))
      } else {
        this.searchList = []
      }
    }, 1000)
  }
}
</script>

<style lang="less">
.img {
  &_avatar { width: 60rpx; height: 60rpx; border-radius: 50%; }
  &_device { width: 60rpx; height: 60rpx; border-radius: 50%; margin-right: 10rpx; }
  &_arrow_down { width: 17rpx; height: 12rpx; }
  &_question { width: 34rpx; height: 34rpx; margin-left: 40rpx; }
  &_scan { width: 32rpx; height: 32rpx; margin-left: 30rpx; }
}
.TopSearch {
  width: 720rpx;
  height: 80rpx;
  position: absolute;
  top: 8rpx;
  z-index: 1;
  background: #fff;
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  box-shadow: 0 0 6rpx #ccc;
  padding: 0 20rpx;
  .img_avatar {
    position: relative;
    height: 70rpx;
    width: 70rpx;
    &::before {
      display: inline-block;
      position: absolute;
      top: 10%;
      right: 10%;
      content: '';
      height: 16rpx;
      width: 16rpx;
      border-radius: 50%;
      background: #878B8E;
    }
    &.online::before {
      background: #44b38a;
    }
  }
  .search {
    margin-left: 30rpx;
    display: flex;
    align-items: center;
    flex: 1;
    color: #44b38a;
    justify-content: space-between;
    .name {
      flex: 1;
      padding-left: 10rpx;
      max-width: 400rpx;
    }
  }
  input::placeholder {
    color: #44b38a;
    font-size: 28rpx;
  }
  .cancel {
    color: #44b38a;
    font-size: 28rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
  }
}
.img_scan {
  width: 55rpx;
  height: 55rpx;
}
.DeviceList {
  position: fixed;
  top: 98rpx;
  z-index: 3;
  width: 720rpx;
  height: 0;
  overflow-y: auto;
  background: #fff;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8rpx;
  box-shadow: 0 0 6rpx #ccc;
  transition: height .3s ease;
  &.open {
    height: 87vh;
  }
  .item {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 26rpx;
    transition: background .3s ease;
    &.active {
      background: rgb(193, 239, 247);
    }
    &+& {
      border-top: 1rpx solid #ccc;
    }
    .radius {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background: gray;
      &.online {
        background: #44b38a;
      }
    }
    &.more {
      color: #999;
      justify-content: center;
      border-top: 1rpx solid #eee;
      margin-top: 20rpx;
    }
  }
}
</style>