<template>
  <div class="device_edit">
    <div class="device_img_box">
      <p @click="unbindEvent" class="jiebang">解绑</p>
      <img @click="uploadImage" class="person_img" :src="deviceInfo.babyAvatar?deviceInfo.babyAvatar:'/static/resources/setting/person.png'" />
      <p style="margin-top:-50rpx;"><img class="photo_img" src="/static/resources/setting/photo.png"/></p>
      <!-- <p>上传图片</p> -->
      <div class="img_box">
        <div class="img_text">
          <p>{{deviceInfo.effectiveTimeStr}}</p>
          <p>到期</p>
        </div>
        <div class="img_text">
          <p>{{deviceInfo.smsAmount}}</p>
          <p>短信剩余</p>
        </div>
      </div>
    </div>
    <div class="edit_box">
      <p class="edit_p">
        <span>IMEI</span>
        <span>{{deviceInfo.imei}}</span>
      </p>
      <p class="edit_p">
        <span>名称</span>
        <span> <input class="namd_text" type="text" v-model="deviceInfo.babyName" placeholder="请输入名称"/></span>
        <!-- <span>{{deviceInfo.babyName}}</span> -->
      </p>
      <p class="edit_p">
        <span>ICCID</span>
        <span>{{deviceInfo.iccid}}</span>
      </p>
    </div>
    <div class="btn_box" @click="resetEvent">
      <button @click="save" type="" :disabled="disabled" :loading='disabled' hover-class=“button-hover”>保存</button>
    </div>
  </div>
</template>

<script>
export default {
    data: () => ({
      'imei': '',
      deviceInfo: {
        agent: 1,
        area: null,
        babyAvatar: "",
        babyBirthday: null,
        babyGrade: null,
        babyName: "",
        babySex: null,
        bindTime: 0,
        createTime: 0,
        deviceMobile: null,
        displacementAlarm: 3,
        displacementAppNotice: true,
        displacementSmsNotice: true,
        dormancyEndTime: "00:00",
        dormancyOn: false,
        dormancyStartTime: "00:00",
        effectiveTime: 0,
        effectiveTimeStr: "0",
        electricity: 95,
        electricityAlarm: 2,
        electricityAppNotice: true,
        electricitySmsNotice: false,
        electricityUpdateTime: 0,
        fenceAppNotice: true,
        fenceOn: 3,
        fenceSmsNotice: true,
        gpsOn: true,
        iccid: "0",
        imei: "0",
        lastActivityTime: 0,
        lbsOn: false,
        ledOn: false,
        monitorMobile1: "0",
        monitorMobile2: "0",
        neverCloseGps: true,
        neverSleep: false,
        offlineAlarm: 3,
        online: false,
        powerFullTime: 0,
        powerOffAlarm: 3,
        powerOffAppNotice: true,
        powerOffSmsNotice: true,
        powerSaving: false,
        pushSwitch: false,
        refreshTime: 10,
        shutdownEndTime: "00:00",
        shutdownOn: true,
        shutdownStartTime: "00:00",
        signal: 95,
        smsAmount: 10,
        sosAlarm: 3,
        sosMobile: "0",
        timeZone: null,
        tremorAlarm: 2,
        tremorAppNotice: true,
        tremorSmsNotice: false,
        type: 0,
        userId: null,
        version: "",
        voiceControlAudio: false,
        wifiOn: true
      },
      disabled:false,
      urlObj: {},
      url: [],
      count: 1
    }),
    onLoad(options){
      console.log(options.imei)
      this.imei = options.imei || this.$store.state.imei
      this.getDeviceInfo();
    },
    methods:{
      async getDeviceInfo(){
        const { success, data, msg }  = await this.$http.deviceGet({'imei':this.imei })
        if(!success){
          return wx.showToast({ title: msg, icon: 'none' })
        }
        if(data){
          this.deviceInfo = data;
        }
      },
      unbindEvent(){
        const that = this
        wx.showModal({
          title: '',
          content: '请确认是否解绑？',
          success: (res) => {
            if (res.confirm) {
                console.log('用户点击确定')
                that.unbind();
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
          }
        })
      },
      async unbind(){
        const { success, data, msg } = await this.$http.deviceUnBind({'imei':this.imei })
        if(success){
          wx.showToast({
            title: '解绑设备成功',
            icon: 'none'
          })
        }
      },
      async save(){
        console.log({'imei':this.imei, babyName: this.deviceInfo.babyName})
        this.disabled = true
          const { success, data, msg }  = await this.$http.deviceUpdate(
            {imei:this.imei,
             babyName: this.deviceInfo.babyName,
             babyAvatar:this.deviceInfo.babyAvatar
            })
          if(!success){
            this.disabled = false
            return wx.showToast({ title: msg, icon: 'none' })
          }
          if(data){
            this.disabled = false
            return wx.showToast({ title: '修改成功', icon: 'none' })
          }
      },
      async uploadImage() {
        let chooseRes = { errno: 3021 }
        try {
            chooseRes = await wx.chooseImage({ count: this.count })
        } catch (error) {
            if (error.errMsg !== 'chooseImage:fail cancel') {
                chooseRes = { errno: 3022 }
            }
        }
        console.log(chooseRes)
        if (chooseRes.errno === 3022) {
            this.toast('warning', '图片选择异常')
            return
        }
        if (chooseRes.errno === 3021) {
            return
        }
        const path = chooseRes.tempFilePaths[0]
        console.log(11,path)
        // this.deviceInfo.babyAvatar =  path
        const res = await this.upload(path)
        if (res.errno !== 0) {
          this.toast('warning', '上传异常')
          return
        }
        console.log(res)
        // this.deviceInfo.babyAvatar =  path
        // this.$emit('on-upload-event', { src: res.data.url, name: res.data.name, index: this.url.key })
      },
      async upload(filePath) {
        // let fileData = {}
        const that = this
        try {
          wx.uploadFile({
            url: 'https://api.youshusoft.com/gpsserver/api/file/img/upload',
            filePath,
            name: "file",
            header: { 
              'Content-Type': 'multipart/form-data',
              // 'Authorization': wx.getStorageSync("access_token"),  //如果需要token的话要传
            },
            success(res){
              console.log(res)
              const fileData = JSON.parse(res.data)
              console.log(fileData)
              that.deviceInfo.babyAvatar = fileData.data

            }
          })
        } catch (e) {
          console.log(e)
        }

        if (res.data && res.data.errno === 1) {
            return res.data
        }
        try {
            res.data = JSON.parse(res.data)
        } catch (e) {
            // res = { data: { errno: 1 } }
        }
        return res.data
      }
    },
};
</script>

<style lang="less" scoped>
  .device_edit{
    position: absolute;
    background: #F6F6F6;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .device_img_box{
      position: relative;
      background: #4388FF;
      height: 36vh;
      padding-top: 100rpx;
      text-align: center;
      color: #fff;
      width: 100%;
      font-size: 30rpx;
      .jiebang{
        position: absolute;
        top: 0;
        right: 0;
        width: 100rpx;
        height: 90rpx;
        line-height: 90rpx;
      }
      .img_box{
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }
      .img_text{
        display: inline-block;
        width: 50%;
        padding: 0 40rpx 20rpx 40rpx;
        &:nth-child(1){
          text-align: left;
          padding-right: 40rpx;
        }
        &:nth-child(2){
          text-align: right;
          padding-right: 40rpx;
        }
      }
    }
    .edit_box{
      background: #fff;
      font-size: 30rpx;
      .edit_p{
        padding: 0 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        border-bottom: 1rpx solid #F6F6F6;
        >span{
          &:nth-child(1){
            display: inline-block;
            width: 100rpx;
            vertical-align:top;
          }
        }
        .namd_text{
          display: inline-block;
          height: 90rpx;
          line-height: 90rpx;
        }
      }
    }
    .btn_box{
      position: absolute;
      left: 0;
      bottom: 60rpx;
      width: 100%;
      font-size: 30rpx;
      // background: #F6F6F6;
      >button{
        background:#4388FF;
        width: 90%;
        height: 80rpx;
        line-height: 80rpx;
        color: #fff;
        border: none;
        border-radius: 10rpx;
        font-size: 30rpx;
      }
    }
    .person_img{
      height: 160rpx;
      width: 160rpx;
      border-radius: 50%;
    }
    .photo_img{
      height: 60rpx;
      width: 60rpx;
      margin-left: 100rpx;

    }
  }
</style>
