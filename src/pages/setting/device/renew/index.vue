<template>
  <div class="device_renew">
    <div class="device_tab">
      <span @click="changeType(x)" v-for="(x,key) in renewList" :key=key :class="type == x.groupId?'device_checked':''">{{x.groupName}}</span>
    </div>
    <div class="device_info">
      <div>
        <p>
          {{info.babyName}}
          <span v-if="type == 1">({{info.effectiveTimeStr}}到期)</span>
           <span v-else>(短信剩余：{{info.smsAmount}})</span>
          </p>
        <p>IMEI:{{info.imei}}</p>
      </div>
      <div class="person_box">
        <img class="person_img" 
        :src="info.babyAvatar?info.babyAvatar:'/static/resources/setting/person.png'"/>
        <!-- <img class="arr_right" src="/static/resources/arr_right.png"/> -->
      </div>
    </div>
    <div class="device_chongzhi">
      <p class="chongzhi_text">充值</p>
      <div class="chongzhi_price">
        <span v-for="(x,key) in list" :key=key @click="checkPrice(x)" :class="x.id== id?'chongzhi_price_checked':''">
          <p>{{x.name}}</p>
          <p>{{x.priceName}}</p>
        </span>
      </div>
    </div>
    <div class="device_wechat">
      <img class="wechat_img" src="/static/resources/setting/wechat.png"/>
      <span>微信支付</span>
      <label class="checkbox device_radio">
        <switch :checked="isWechat" @change="handleChange" color="#4388FF" type="checkbox"/>

      </label>
    </div>
    <div class="btn_box">
      <button type=""  @click="payChange" :disabled="disabled" :loading=disabled hover-class=“button-hover”>确认支付</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      renewList: [{name:'设备续费',type:1},{name:'短信充值',type:2}],
      list:[],
      // list1:[],
      type: '1',
      id: '',
      imei:'',
      info: {},
      code: '',
      isWechat: true,
      // payList:[{value: true, name: '微信', checked: true}],
      disabled: false
    }
  },
  onLoad(options){
    console.log(options.imei)
    this.imei = options.imei
    this.getPayList();
    this.getDeviceInfo();
  },
  methods: {
    async getDeviceInfo(){
      let { success, data, msg } = await this.$http.deviceGet({'imei':this.imei })
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      if(data){
        this.info = data
      }
    },
    async getPayList(){
      let { success, data, msg } = await this.$http.payRechargeList({'imei':this.imei})
      if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
      if(data){
        this.renewList = data;
        this.list =data[0].list;
        this.type = data[0].groupId;
        this.id = this.list[0].id
      }
    },
    changeType(x){
      this.type = x.groupId
      this.list = x.list
      this.id = x.list[0].id
    },
    checkPrice(x){
      this.id = x.id
      },
    handleChange(e){
      console.log(e)
      this.isWechat = e.target.value
    },
    payChange(){
      let that = this
      if(!this.isWechat){
        return wx.showToast({ title: '请选择微信支付', icon: 'none' })
      }
      wx.login({
        success: res=>{
          that.pay({
            rechargeId: that.id, 
            imei: that.imei,
            tradeType:'JSAPI',
            code: res.code
          })
        }
      });     
    },
    async pay(obj){
      const that = this
      this.disabled = true
       const { success, data, msg } = await this.$http.payRechargePayWx(obj)
      if (!success) { this.disabled = false; return wx.showToast({ title: msg, icon: 'none' }) }
      if(data && data.payInfo){
         wx.requestPayment({
          appid: data.payInfo.appid,
          timeStamp: data.payInfo.timestamp,
          nonceStr: data.payInfo.noncestr,
          package: `prepay_id=${data.payInfo.prepayid}`,
          signType: 'MD5',
          paySign: data.payInfo.sign,
          prepayid: data.payInfo.prepayid,
          success:function(res){
            that.getDeviceInfo();
            that.disabled = false
          },
          fail:function(res){
            console.log(res)
            that.disabled = false
            wx.showToast({ title: '支付失败', icon: 'none' })
          },
          complete:function(res){
            console.log(res)
          }
        })
      }
    }
      
  }
};
</script>

<style lang="less" scoped>
  .device_renew{
    position: absolute;
    top: 0;
    left: 0;
    background: #F6F6F6;
    height: 100%;
    width: 100%;
    .device_tab{
      display: flex;
      background: #fff;
      height: 130rpx;
      line-height: 90rpx;
      text-align: center;
      color: #000;
      >span{
        display: inline-block;
        // width: 50%;
        flex:1;
        border-bottom: 1rpx solid #fff;
      }
      .device_checked{
        color: #4388FF;
        border-bottom: 1rpx solid #4388FF;
      }
    }
    .device_info{
      position: relative;
      background: #fff;
      padding: 40rpx;
      color: #000;
      font-size: 28rpx;
      margin-top: 30rpx;
      >.person_box{
        position: absolute;
        top: 36rpx;
        right: 40rpx;
      }
      p{
        &:nth-child(1){
          margin-top: 10rpx;
        }
      }
    }
    .device_chongzhi{
      background: #fff;
      padding: 40rpx;
      font-size: 34rpx;
      .chongzhi_text{
        margin-bottom: 60rpx;
      }
      .chongzhi_price{
        display: flex;
        >span{
          flex: 1;
          height: 100rpx;
          padding: 10rpx 0;
          line-height: 48rpx;
          border: 1rpx solid #4388FF;
          border-radius: 10rpx;
          text-align: center;
          margin-right: 18rpx;
          color: #4388FF;
          margin-bottom: 10rpx;
          font-size: 28rpx;
        }
        .chongzhi_price_checked{
          background: #4388FF;
          color: #fff;
        }
      }
    }
    .device_wechat{
      background: #fff;
      margin-top: 30rpx;
      height: 120rpx;
      line-height: 90rpx;
      padding: 20rpx 40rpx;
      font-size: 28rpx;
      >span{
        display: inline-block;
        height: 90rpx;
        line-height: 90rpx;
        vertical-align: top;
      }
      .device_radio{
        float: right;
      }
      .wechat_img{
        margin-top: 7rpx;
        margin-right: 30rpx;
      }
    }
    .btn_box{
      margin-top: 40rpx;
      >button{
        background: #4388FF;
        width: 80%;
        height: 90rpx;
        line-height: 90rpx;
        color: #fff;
        border: none;
        border-radius: 10rpx;
        font-size: 30rpx;
      }
    }
    .person_img{
      height: 76rpx;
      width: 76rpx;
      margin-right: 30rpx;
    }
    .arr_right{
      height: 35rpx;
      width: 18rpx;
      vertical-align: top;
      margin-top: 25rpx;
    }
    .wechat_img{
      height: 75rpx;
      width: 75rpx;
    }
  }
</style>
