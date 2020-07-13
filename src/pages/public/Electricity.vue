<template>
  <img class="device_batteray" :src="src"/>
</template>

<script>
export default {
  props: {
    electricity: Number
  },
  computed: {
    src () {
      let img = 'batteray_0.png'
      if (this.electricity > 90) {
        img = 'batteray_100.png'
      } else if (this.electricity > 60) {
        img = 'batteray_75.png'
      } else if (this.electricity > 30) {
        img = 'batteray_50.png'
      } else if (this.electricity > 5) {
        img = 'batteray_30.png'
      }
      return '/static/resources/setting/' + img
    }
  }
}
</script>

<style lang="less">
.device_batteray {
  width: 35rpx;
  height: 20rpx;
}
</style>
