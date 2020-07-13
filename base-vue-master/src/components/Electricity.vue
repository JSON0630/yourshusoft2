<template>
  <img class="device_batteray" :src="src"/>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  /** v-model 显隐 */
  @Prop({ default: 100 }) electricity!: number
  get src () {
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
    return 'static/' + img
  }
}
</script>

<style lang="less">
.device_batteray {
  width: 35px;
  height: 20px;
}
</style>
