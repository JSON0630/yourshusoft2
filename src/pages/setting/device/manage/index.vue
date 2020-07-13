<template>
  <div class="device_list">
    <div class="device_fixed">
       <div class="device_tab">
      <span
        @click="changeTabs(x,key)"
        v-for="(x,key) in tabsList"
        :key=key
        :class="keyIndex == x.value ? 'device_checked':''"
      >{{ x.name }}({{ x.count }})</span>
    </div>
    <div class="search_box">
      <div class="search">
        <img class="search_img" @click="search" src="/static/resources/setting/search.png"/>
        <input class="search_text" type="text" @confirm="search" v-model="deviceName" placeholder="请输入设备名"/>
        <img class="search_img search_del" @click="cancelText" src="/static/resources/setting/cha.png"/>
      </div> 
    </div>
    </div>
   
    <scroll-view scroll-y class="device_box"> 
        <div v-if="!loading && list.length>0">
          <div class="device_item" v-for="(x,key) in list" :key=key>
            <div class="device_item_top">
              <img class="device_person" :src="x.babyAvatar?x.babyAvatar:'/static/resources/setting/person.png'"/>
              <div>
                <p class="device_status">
                  <span class="device_name">{{x.babyName}}</span>
                    <span :class="x.online?'online': 'offline'"> 
                      {{x.online?'在线':'离线'}}
                    </span>
                  <span class="device_batteray_span">
                    <Electricity :electricity="x.electricity" />
                    <i style="display:inline-block;width:60rpx;text-algin:left;">{{x.electricity }}%</i>
                    </span>
                </p>
                <p class="device_ads">{{x.location.address}}</p>
              </div>
            </div>
            <div class="device_item_bottom">
              <p @click="goDingwei(x)" >
                <img class="device_dingwei" src="/static/resources/setting/dingwei.png"/>
                定位
              </p>
              <p @click="goTrack(x)">
                <img class="device_guiji" src="/static/resources/setting/guiji.png"/>
                  轨迹
              </p>
              <p @click="goSetting(x)">
                <img class="device_set" src="/static/resources/setting/set.png"/>
                  设置
              </p>
              <p @click="more(x)"> 
                <img class="device_more" src="/static/resources/setting/more.png"/>
                  更多
              </p>
            </div>
          </div>
      </div>
      <p v-else style="color:#878B8E;font-size:30rpx;margin-top: 289rpx;text-align: center;">暂无数据</p>

    </scroll-view>
  </div>
</template>

<script>
import Electricity from '@/pages/public/Electricity.vue'
import { H5 } from '@/global/constants'

  export default {
    components: {
      Electricity
    },
    data () {
      return {
        loading: true,
        current: 3,
        keyIndex: '0',
        deviceName:'', 
        page: 1,
        list: [],
        listInfo: {
          allTotal: 0,
          onlineTotal: 0
        }
      }
    },
    computed: {
      tabsList () {
        const { allTotal, onlineTotal } = this.listInfo
        return [
          { name:'全部',value:'0', count: allTotal },
          { name:'在线',value:'1', count: onlineTotal },
          { name:'离线', value:'2',count: allTotal - onlineTotal }
        ]
      }
    },
    onLoad(){
      this.list = []
      this.getDeviceList({
        type: this.keyIndex,
        size: 10,
        number: this.page,
        keyword: ''
      })
    },
    methods: {
      async getDeviceList(obj){
        wx.showToast({ title: '加载中...', icon: 'loading', duration: 3000 })
        const { success, data, msg }  = await this.$http.deviceList(obj)
        this.loading = false
        wx.hideToast()
        if(!success){ return wx.showToast({ title: msg, icon: 'none' }) }
        this.listInfo = { allTotal: data.allTotal, onlineTotal: data.onlineTotal }
        if (!data.dataList.length) { return wx.showToast({ title: '暂无设备', icon: 'none' }) }
        this.list = Object.freeze(this.list.concat(data.dataList))
        console.log(this.list,'list')
      },
      changeTabs(x,key){
        this.keyIndex =x.value
        this.page = 1
        this.list = []
        this.getDeviceList({
            type: this.keyIndex,
            size: 10,
            number: this.page,
            keyword: ''
          }
        );
      },
      search(){
        this.page = 1
        this.list = []
        this.getDeviceList({
            type: this.keyIndex,
            size: 10,
            number: 1,
            keyword: this.deviceName
          }
        );
      },
      cancelText(){
        this.deviceName = ''
        this.page = 1
        this.list = []
        this.getDeviceList({
            type: this.keyIndex,
            size: 10,
            number: 1,
            keyword: this.deviceName
          }
        );
      },
      goTrack(item) {
        wx.navigateTo({
          url: H5.getTrackPath(item.imei)
        })
      },
      /** 定位 */
      goDingwei (item) {
        wx.navigateTo({
          url: H5.getPosPath(item.imei, item.babyName)
        })
      },
      goSetting(item){
        wx.navigateTo({url: `/pages/setting/device/setting/main?imei=${item.imei}`})
      },
      more(item){
        const that =this
        wx.showActionSheet({
          itemList: ['编辑', '解绑','续费'],
          success (res) {
            if(res.tapIndex == 0){
              wx.navigateTo({url: `/pages/setting/device/edit/main?imei=${item.imei}`})
            }else if(res.tapIndex == 1){
              that.unbindEvent()
            }else if(res.tapIndex == 2){
              wx.navigateTo({url:`/pages/setting/device/renew/main?imei=${item.imei}`})
            }
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
      },
      unbindEvent(){
         wx.showModal({
          title: '',
          content: '请确认是否解绑？',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
                this.unbind();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      async unbind(){
        const { success, data, msg }  = await this.$http.deviceUnBind({'imei':this.imei })
        if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
        wx.showToast({ title: '解除绑定', icon: 'none' }) 
        that.getDeviceList({
          type: this.keyIndex,
          size: 10,
          number: 1,
          keyword: this.deviceName
        })
        
      },
    },
    onReachBottom(){
      this.page++
      this.getDeviceList({
          type: this.keyIndex,
          size: 10,
          number: this.page,
          keyword: this.deviceName
        }
      );
    }
  };
</script>

<style lang="less" scoped>
.device_list{
  position: relative;
  height: 100%;
  background: #fff;
  .device_fixed{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .device_tab{
    background: #fff;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 28rpx;
    color: #000;
    >span{
      display: inline-block;
      width: 33.3%;
      border-bottom: 1rpx solid #fff;
      &:nth-child(3){
        &::before{
          display: inline-block;
          content: '';
          height: 16rpx;
          width: 16rpx;
          border-radius: 50%;
          background: #878B8E;
        }
      }
      &:nth-child(2){
        &::before{
          display: inline-block;
          content: '';
          height: 16rpx;
          width: 16rpx;
          border-radius: 50%;
          background: rgb(62, 236, 62);
        } 
      }
    }
    .device_checked{
      color: #4388FF;
      border-bottom: 1rpx solid #4388FF;
    }
  }
  .search_box{
    background: #F6F6F6;
    padding: 25rpx 40rpx;
    .search{
      position: relative;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0rpx 20rpx;
      border: 1rpx solid #808080;
      border-radius: 10rpx;
      >.search_text{
        position: absolute;
        left: 60rpx;
        top: 0;
        width: 60%;
        height: 80rpx;
        line-height: 80rpx;
        padding-left: 40rpx;
        padding-right: 60rpx;
        font-size: 30rpx;
        border: none;

      }
      .search_del{
        position: absolute;
        right: 8%;
        z-index: 1;
      }
    }
  }
  .device_box{
    position: absolute;
    top: 0;
    left: 0;
    padding-bottom: 20rpx;
    padding-top: 245rpx;
  }
  .device_item{
    .device_item_top{
      padding: 20rpx 20rpx 20rpx 20rpx; 
      border-bottom: 1rpx solid #F6F6F6;
      div{
        display: inline-block;
        width: 89%;
      }
      .device_status{
        padding: 0rpx 20rpx;
        display: block;
        .device_name{
          color: #000;
        }
        .device_batteray_span,.offline,.online{
          float: right;
        }
        .offline{
          margin-left: 30rpx;
          &::before{
            display: inline-block;
            content: '';
            height: 16rpx;
            width: 16rpx;
            border-radius: 50%;
            background: #878B8E;
          }
        }
        .online{
          margin-left: 30rpx;
          &::before{
            display: inline-block;
            content: '';
            height: 16rpx;
            width: 16rpx;
            border-radius: 50%;
            background: rgb(62, 236, 62);
          }
        }
      }
      .device_ads{
        padding: 0rpx 20rpx;
      }
    }
    .device_item_bottom{
      padding: 10rpx 20rpx; 
      border-bottom: 1rpx solid #F6F6F6;
      >p{
        width: 25%;
        text-align: center;
      }
    }
    p{
      display: inline-block;
      color: #878B8E;
      font-size: 26rpx;
      >img{
        margin-right: 8rpx;
      }

    }
  }
  
  .search_img,.search_del{
    height: 36rpx;
    width: 36rpx;
    margin-top: 22rpx;
  }
  /deep/.device_batteray{
    margin-right: 10rpx;
  }
  .device_guiji,.device_set,.device_dingwei{
    height: 35rpx;
    width: 35rpx;
    vertical-align: bottom;
  }
  .device_more{
    height: 12rpx;
    width: 30rpx;
  }
  .device_person{
    height: 75rpx;
    width: 75rpx;
  }
}
</style>
