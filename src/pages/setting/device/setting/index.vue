<template>
  <div class="device_setting">
    <div class="device_setting_box">
      <div class="device_setting_item">
        <div class="device_text" @click="isTimeShow =!isTimeShow">
          <span>省电设置</span>
          <img class="arr_right"  src="/static/resources/arr_right.png"/>
        </div>
        <div class="shengdian_set" v-show="isTimeShow">
          <p class="time_zidong">自动定位时间</p>
          <div class="time_list">
            <radio-group @change="radioChange">
              <div class="time_item" v-for="(x,key) in items" :key=key >
                <span>{{x.label}}</span>
                <label class="radio"><radio :value="x.value" :checked="x.checked" color="#4388FF"/></label>
              </div>
            </radio-group>
          </div>
          <p class="time_title">提示：设置的时间越短，位置更新越快轨迹越连贯同时电量和流量消耗越快，建议不同的需求设置不同的时间</p>
        </div>
      </div>
      <div class="device_setting_item device_ding">
        <div class="device_text" @click="isPositionShow =!isPositionShow">
          <span>定位设置</span>
          <img class="arr_right"  src="/static/resources/arr_right.png"/>
        </div>
        <div class="dingwei_set" v-show="isPositionShow">
          <div class="dingwei_list">
            <div class="dingwei_item">
              <span>GPS+A-GPS+北斗</span>
              <label class="device_switch">
                <switch :checked="info.gpsOn" @change="switch1Change" color="#4388FF"/>
              </label>
            </div>
            <p class="dingwei_p">卫星定位只适用于室内，默认开启（精确度高）</p>
            <div class="dingwei_item">
              <span>Wi-Fi</span>
              <label class="device_switch">
                <switch  :checked="info.wifiOn" @change="switch2Change" color="#4388FF"/>
              </label>

            </div>
            <p class="dingwei_p">WiFi热点定位适用于室内与室外（精确度中）</p>
            <div class="dingwei_item">
              <span>LBS基站</span>
              <label class="device_switch">
                <switch :checked="info.lbsOn" @change="switch3Change" color="#4388FF"/>
              </label>
            </div>
            <p class="dingwei_p">基站定位适用于室内与室外（精确度低）</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_box" @click="resetEvent">
      <button type="" :disabled="disabled" :loading=loading hover-class=“button-hover”>重启设备</button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        info:{
          gpsOn: true,
          wifiOn: true,
          lbsOn: true,
        },
        isTimeShow: false,
        isPositionShow:false,
        imei:'',
        items:[
          {
            label:'10秒（耗电极快）',
            value: 10,
            checked: true
          },
          {
            label:'1分钟（耗电快）',
            value: 60
          },
          {
            label:'5分钟（耗电一般）',
            value: 300
          },
          {
            label:'10分钟（省电）',
            value: 600
          },
          {
            label:'60分钟（非常省电）',
            value: 3600
          },
          {
            label:'120分钟（超级省电）',
            value:7200
          }
        ]
      }
    },
    mounted(){
      this.getDeviceInfo();
    },
    onLoad (options) {
      console.log(options)
      this.imei = options.imei|| this.$store.state.imei
    },
    methods: {
      async getDeviceInfo(){
        const { success, data, msg } = await this.$http.deviceGet({'imei':this.imei })
        if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
        if(data){
          this.info = data;
          for(let i =0; i<this.items.length;i++){
              if(this.info.refreshTime == this.items[i].value){
                  this.items[i].checked = true
              }
          }

        }
      },
      switch1Change(e){
        console.log(e.target.value)
        this.deviceUpdate({gpsOn: e.target.value})
      },
      switch2Change(e){
        console.log(e.target.value)
        this.deviceUpdate({wifiOn: e.target.value})
      },
      switch3Change(e){
        console.log(e.target.value)
        this.deviceUpdate({lbsOn: e.target.value})
      },
      async radioChange (e) {
        console.log('radio发生change事件，携带value值为：', e.target.value)
        this.deviceUpdate({refreshTime: e.target.value})
      },
      async deviceUpdate(obj){
        const { success, data, msg } = await this.$http.deviceUpdate({'imei':this.imei, ...obj})
        if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
        if(data){
          wx.showToast({
              title: '设置成功',
              icon: 'none',
              duration: 2000
          })
        }
      },
      resetEvent(){
        const that = this
        wx.showModal({
          title: '',
          content: '请确认是否重启设备？',
          success (res) {
            if (res.confirm) {
                console.log('用户点击确定')
                that.reset();
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
          }
        })
      },
      async reset(){
        const { success, data, msg } = await this.$http.deviceRestart({'imei':this.imei })
        if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
        if(data){
          wx.showToast({
            title: '重启设备成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .device_setting{
    position: relative;
    background: #F6F6F6;
    padding: 40rpx 20rpx;
    font-size: 36rpx;
    // overflow: hidden;
    .device_setting_box{
      position: absolute;
      width: 100%;
      // height: 100%;
      top: 0;
      left: 0;
      padding-bottom: 220rpx;
      background: #fff;
      .device_text{
        padding: 0 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        .arr_right{
          float: right;
          margin-top: 25rpx;
        }
      }
      .shengdian_set{
        .time_zidong{
          background: #F6F6F6;
          height: 60rpx;
          line-height: 60rpx;
          padding-left: 25rpx;
          font-size: 20rpx;
          color: #878B8E;
        }
        .time_list{
          .time_item{
            padding: 0rpx 20rpx;
            border-bottom: 1rpx solid #F6F6F6;
            height: 100rpx;
            line-height: 100rpx;
            font-size: 28rpx;
            .radio{
              float: right;
            }
          }
        }
        .time_title{
          background: #F6F6F6;
          padding: 20rpx 30rpx;
          line-height: 1.5;
          font-size: 24rpx;
          color: #878B8E;
        }
      }
    }
    .device_ding{
      background: #F6F6F6;
      .device_text{
        background: #fff;
        margin-bottom: 30rpx;
      }
    }
    .dingwei_set{
      background: #F6F6F6;
      // margin-top: 30rpx;
      font-size: 36rpx;
      .dingwei_list{
        .dingwei_item{
          position: relative;
          // margin-top: 30rpx;
          background: #fff;
          padding: 0rpx 20rpx;
          height: 100rpx;
          line-height: 100rpx;
          font-size: 28rpx;
          >span{
            display: inline-block;
            width: 81%;
          }
          .device_switch{
            // position: absolute;
            // top: 30rpx;
            // right: 30rpx;
            width: 42rpx;
            height: 25rpx;
          }
        }
        .dingwei_p{
          height: 60rpx;
          line-height: 60rpx;
          padding-left: 25rpx;
          font-size: 24rpx;
          color: #878B8E;
        }
      }

    }

    .btn_box{
      position: fixed;
      bottom: 0rpx;
      left: 0;
      width: 100%;
      padding-bottom: 80rpx;
      background: #F6F6F6;
      z-index: 10;
      >button{
        background:#E64340;
        width: 90%;
        height: 80rpx;
        color: #fff;
        border: none;
        border-radius: 10rpx;
        font-size: 30rpx;
      }
    }
    .arr_right{
      height: 35rpx;
      width: 18rpx;
    }
  }
</style>
