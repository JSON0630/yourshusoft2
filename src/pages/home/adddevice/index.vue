<template>
  <div class="device_edit">
    <div class="edit_box">
      <p class="edit_p">
        <span> <input class="namd_text" type="text" v-model="deviceInfo.imei" placeholder="请输入设备码"/></span>
      </p>
      <p class="edit_p">
        <span> <input class="namd_text" type="text" v-model="deviceInfo.name" placeholder="请输入设备名称"/></span>
      </p>
    </div>
    <div class="btn_box">
      <button @click="save" type="" :disabled="disabled" :loading='disabled' hover-class=“button-hover”>添加设备</button>
    </div>
  </div>
</template>
 
<script>
export default {
    data: () => ({
      deviceInfo: {
        name:'',
        imei:''
      },
      disabled:false
       
    }),
    onLoad(options){
      console.log(options.imei)
      this.deviceInfo.imei = options.imei
    },
    methods:{
      async save(){
        if(!this.deviceInfo.imei){
         wx.showToast({ title: '请输入设备码', icon: 'none' })
         return
        }
        this.disabled = true
        const { success, data, msg }  = await this.$http.deviceBind(
          {imei:this.deviceInfo.imei,
            name: this.deviceInfo.name
          })
        if(!success){
          this.disabled = false
          return wx.showToast({ title: msg, icon: 'none' })
        }
        this.disabled = false
        wx.showToast({ title: '添加设备成功', icon: 'none' })
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
    padding: 40rpx 20rpx;
    .edit_box{
      font-size: 30rpx;
      .edit_p{
        background: #fff;
        padding: 0 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        border-bottom: 1rpx solid #F6F6F6;
        margin-bottom: 30rpx;
        .namd_text{
          display: inline-block;
          height: 90rpx;
          line-height: 90rpx;
        }
      }
    }
    .btn_box{
      // position: absolute;
      // left: 0;
      // bottom: 60rpx;
      width: 100%;
      font-size: 30rpx;
      // background: #F6F6F6;
      >button{
        background:#4388FF;
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        color: #fff;
        border: none;
        border-radius: 10rpx;
        font-size: 30rpx;
      }
    }
  }
</style>