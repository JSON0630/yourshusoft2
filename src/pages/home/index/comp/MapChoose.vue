<template>
  <block>
    <div class="MapChoose" :class="{isTop}" @click="showDrawer=true">
      <img class="img_map" src="/static/resources/home/map.png" alt="">
      <div>地图</div>
    </div>
    <Drawer v-model="showDrawer">
      <div class="DrawerMap">
        <div class="title">地图类型</div>
        <div class="content">
          <div
            class="item"
            v-for="(x, i) in mapTypes"
            :key="i"
            :class="{active: mapType === x.label}"
            @click="$emit('change', x.label)"
          >
            <img class="img_label" :src="x.src" alt="">
            <div>{{x.label}}</div>
          </div>
        </div>
      </div>
    </Drawer>
  </block>
</template>

<script>
import Drawer from '@/components/Drawer'
import { MAP_TYPE } from '@/global/constants'

export default {
  components: { Drawer },
  props: {
    isTop: Boolean,
    mapType: String
  },
  data: () => ({
    showDrawer: false
  }),
  computed: {
    mapTypes () {
      return Object.entries(MAP_TYPE).map(([type, label]) => ({type, label, src: `/static/resources/home/${type}.png`}))
    }
  }
}
</script>

<style lang="less">
.MapChoose {
  position: absolute;
  top: 18vh;
  right: 17rpx;
  border-radius: 14rpx;
  width: 72rpx;
  height: 90rpx;
  background: #fff;
  z-index: 2;
  color: #999;
  font-size: 20rpx;
  text-align: center;
  padding: 12rpx 16rpx 8rpx;
  transition: top .3s ease;
  &.isTop { top: 12vh; }
  .img {
    &_map { width: 29rpx; height: 28rpx; }
  }
}
.DrawerMap {
  width: 70vw;
  height: 100vh;
  background: #f8f8f8;
  color: #999;
  font-size: 28rpx;
  .title {
    padding: 6rpx 20rpx;
  }
  .content {
    background: #fff;
    display: flex;
    padding: 20rpx;
    .item {
      margin-right: 20rpx;
      text-align: center;
      &.active {
        color: #4c8eff;
        .img_label {
          border-color: #4c8eff;
          &::after {
            content: '✓';
            text-align: center;
            color: white;
            position: absolute;
            bottom: 0;
            left: 0;
            font-size: 38rpx;
            height: 45rpx;
            line-height: 45rpx;
            width: 100%;
            background: #4c8eff;
          }
        }
      }
      .img_label {
        position: relative;
        width: 195rpx;
        height: 150rpx;
        margin-bottom: 10rpx;
        border: 2px solid transparent;
        border-radius: 9px;
      }
    }
  }
}
</style>
