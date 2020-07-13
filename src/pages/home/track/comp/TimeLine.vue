<template>
  <movable-area class="TimeLine">
    <div class="midline" :class="{reverse: pointAnum > pointBnum}" :style="{left, right}"></div>
    <movable-view direction="horizontal" class="point a" @change="hadleChangePointStart">
      <div class="hour">{{pointAHour + ':00'}}</div>
    </movable-view>
    <movable-view direction="horizontal" class="point b" @change="hadleChangePointEnd">
      <div class="hour">{{pointBHour + ':00'}}</div>
    </movable-view>
  </movable-area>
</template>

<script>
const MAX_HOUR = 24
export default {
  props: {
    startHour: String,
    endHour: String
  },
  data: () => ({
    MAX_X: '242',
    pointAx: 0,
    pointBx: 0
  }),
  computed: {
    pointAnum () {
      return (this.pointAx / this.MAX_X).toFixed(2)
    },
    pointBnum () {
      return (this.pointBx / this.MAX_X).toFixed(2)
    },
    start () {
      return Math.min(this.pointAnum, this.pointBnum)
    },
    end () {
      return Math.max(this.pointAnum, this.pointBnum)
    },
    left () {
      return 100 * this.start + '%'
    },
    right () {
      return 100 * (1 - this.end) + '%'
    },
    pointAHour () {
      return parseInt(this.pointAnum * MAX_HOUR)
    },
    pointBHour () {
      return parseInt(this.pointBnum * MAX_HOUR)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const { select } = wx.createSelectorQuery()
      select('.TimeLine').boundingClientRect(rect => {
        this.MAX_X = rect.width - 10
        console.log(this.MAX_X)
        console.log(this.startHour, this.endHour)
        this.pointAx = this.MAX_X * this.startHour / MAX_HOUR
        this.pointBx = this.MAX_X * this.endHour / MAX_HOUR
        console.log(this.pointAx, this.pointBx)
      }).exec()
    },
    hadleChangePointStart (e) {
      console.log('--++++--', {
        startHour: Math.min(this.pointAHour, this.pointBHour),
        endHour: Math.max(this.pointAHour, this.pointBHour)
      })
      this.$emit('change', {
        startHour: Math.min(this.pointAHour, this.pointBHour),
        endHour: Math.max(this.pointAHour, this.pointBHour)
      })
      this.pointAx = e.x
    },
    hadleChangePointEnd (e) {
      console.log('-------', {
        startHour: Math.min(this.pointAHour, this.pointBHour),
        endHour: Math.max(this.pointAHour, this.pointBHour)
      })
      this.$emit('change', {
        startHour: Math.min(this.pointAHour, this.pointBHour),
        endHour: Math.max(this.pointAHour, this.pointBHour)
      })
      this.pointBx = e.x
    }
  }
}
</script>

<style lang="less">
.TimeLine {
  position: relative;
  width: 240px;
  height: 8rpx;
  border-radius: 4rpx;
  background: #ccc;
  .midline {
    position: absolute;
    height: 8rpx;
    background-image: linear-gradient(90deg, chocolate, cornflowerblue);
    &.reverse {
      background-image: linear-gradient(-90deg, chocolate, cornflowerblue);
    }
  }
  .point {
    position: absolute;
    top: -6rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 10rpx;
    z-index: 2;
    &::before {
      content: '';
      width: 40rpx;
      height: 40rpx;
      border-radius: 20rpx;
      position: absolute;
      left: -10rpx;
      top: -10rpx;
      z-index: 1;
    }
    .hour {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -50rpx;
    }
    &.a {
      left: 0;
      background: chocolate;
      &::before {
        background: rgba(210, 105, 30, 0.6);
      }
    }
    &.b {
      left: 0;
      background: cornflowerblue;
      &::before {
        background: rgba(100, 148, 237, 0.6);
      }
    }
  }
}
</style>
