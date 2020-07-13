<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const token = wx.getStorageSync('TOKEN')
    if (!token) {
      wx.navigateTo({url: '/pages/setting/index/main?login=0'})
    }
  }
}
</script>

<style lang=less>
div {
  box-sizing: border-box;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
}
.flex { display: flex; }
.flex-1 { flex: 1 }
.flex-align-center {
  display: flex;
  align-items: center;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
navigator { display: flex; }
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.mt {
  &-8 { margin-top: 8rpx; }
}
</style>
