<template>
  <div class="message_box">
    <p @click="screenEvent" class="message_shaixuan">{{itemList[index]}}<span></span></p>
    <div class="message_List" v-if="list.length>0">
        <div class="message_item" v-for="(x,key) in list" :key="key">
        <img class="person_img" :src="x.deviceInfo.avatar?x.deviceInfo.avatar:'/static/resources/setting/person.png'"/>
        <div class="message_item_text">
          <p>{{x.deviceInfo.name?x.deviceInfo.name:'--'}}</p>
          <p>{{x.remark?x.remark:'--'}}</p>
          <p>{{x.eventName?x.eventName:'--'}}</p>
          <p>{{x.timeStr}}</p>
        </div>
      </div>
    </div>
    <p  v-else  class="empty" >暂无数据</p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      list: [],
      eventId: 0,
      itemList: ['全部', '围栏', '位移','低电','震动'],
      index: 0
    }),
    mounted(){
     this.getMessageList();
    },
    methods:{
      async getMessageList(){
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 1000
        })
        const { success, data, msg } = await this.$http.noticeList({eventId:this.eventId })
        if (!success) { return wx.showToast({ title: msg, icon: 'none' }) }
        if(data){
            this.list = data;
        }
      },
      screenEvent(){
        const that = this
        wx.showActionSheet({
          itemList: ['全部', '围栏', '位移','低电','震动'],
          success (res) {
            that.index = res.tapIndex
            const arr_item = [0,43,42,41,40];
            that.eventId = arr_item[res.tapIndex]
            that.getMessageList()
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .message_box {
    position: relative;
    background: #F6F6F6;
    height: 100%;
    padding: 0rpx 0rpx;
    .message_shaixuan{
      position: fixed;
      background: #fff;
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 30rpx;
      color: #4EB9FF;
      text-align: center;
      top: 0;
      left: 0;
      span{
        position: absolute;
        top: 50%;
        left: 55%;
        margin-top: -7rpx;
        width: 0;
        height: 0;
        border-left: 15rpx solid transparent;
        border-right: 15rpx solid transparent;
        border-top: 15rpx solid #4EB9FF;
        vertical-align: bottom;
      }
    }
    .message_List{
      margin-top: 110rpx;
      .message_item{
        background: #fff;
        /*height: 220rpx;*/
        padding: 10rpx 30rpx;
        margin-bottom: 30rpx;
        .person_img{
          vertical-align: top;
          margin-top: 30rpx;
        }
        .message_item_text{
          display: inline-block;
          margin-left: 30rpx;
          font-size: 24rpx;
          color: #808080;
          >p{
            margin-bottom: 10rpx;
            &:nth-child(1){
              font-size: 34rpx;
              color: #000;
            }
            &:nth-child(2){
              font-size: 26rpx;
              color: #000;
            }
          }
        }
      }
    }
    .empty{
      font-size:24rpx;
      padding-top:200rpx;
      text-align:center;
      color:#808080;
      background:#fff;
    }
    .person_img{
      height: 120rpx;
      width: 120rpx;
      border-radius: 50%;
    }
  }
</style>
