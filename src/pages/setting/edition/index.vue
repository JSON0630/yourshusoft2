<template>
  <div class="edition">
    <!-- <div class="suogong">
       <img class="suogong_img" src="/static/resources/setting/suogong.png"> 
       <div>索工</div>
       <div class="edit_banben">V 0.0.0</div>
    </div>
    <div class="new_banben">
      <span>当前版本</span>
      <img class="arr_right" src="/static/resources/arr_right.png"> 
       <span class="xin">已是最新版本</span>
    </div>
    <div class="new_banben">
      <span>官网</span>
      <img class="arr_right" src="/static/resources/arr_right.png"> 
    </div> -->
    <web-view src="https://www.suogong.com.cn" />
  </div>
</template>

<script>
  export default {
     data: () => ({
      messageList: [],
      'imei':'',
      count: 1
    }),
    mounted(){
    },
    methods:{

    }
  };
</script>

<style lang="less" scoped>
.edition{
  background: #F6F6F6;
  height: 100%;
  width: 100%;
  padding-top: 6.37vh;
  .suogong{
    text-align: center;
    color: #000;
    .suogong_img{
      margin: 0 auto;
      height: 162rpx;
      width: 162rpx; 
    }
    .edit_banben{
      color: #A2A6B7;
      font-size: 20rpx;
    }

  }
  .new_banben{
    height: 7.8vh;
    line-height: 7.8vh;
    background: #fff;
    padding:0 35rpx;
    border-bottom: 1rpx solid  #F6F6F6;
    .xin{
      float: right;
      color: #A2A6B7;
      font-size: 20rpx;
      margin-right: 20rpx;
    }
  }
  .arr_right{
    float: right;
    height: 35rpx;
    width: 18rpx;
    margin-top: 30rpx;
  }
    
}
</style>
