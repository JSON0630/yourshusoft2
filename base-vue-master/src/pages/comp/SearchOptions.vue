<template>
  <div>
    <div class="DateBtn" @click="showDrawer=true">{{ keys.date }}</div>
    <Drawer v-model="showDrawer" from="bottom">
      <div class="SearchOptions">
        <div class="item">
          <div class="name">当前选择:</div>
          <input id="date" type="date" v-model="keys.date">
        </div>
        <div class="item">
          <div class="name">时间段:</div>
          <input id="startTime" type="time" v-model="keys.startTime">
          <div class="split">-</div>
          <input id="endTime" type="time" v-model="keys.endTime">
        </div>
        <div class="item">
          <div class="name">轨迹显示:</div>
          <div class="checkboxs">
            <input type="checkbox" id="jack" value="1" v-model="keys.dataTypeList">
            <label for="jack">gps</label>
            <input type="checkbox" id="john" value="2" v-model="keys.dataTypeList">
            <label for="john">WIFI</label>
            <input type="checkbox" id="mike" value="3" v-model="keys.dataTypeList">
            <label for="mike">基站</label>
          </div>
        </div>
        <div class="item">
          <div class="name">智能纠偏:</div>
          <CheckSwitch v-model="keys.rectify"/>
        </div>
        <div class="submit" type="primary" @click="submit">查询</div>
      </div>
    </Drawer>
  </div>
</template>

<script lang=ts>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import Drawer from '@/components/Drawer.vue'
import CheckSwitch from '@/components/Switch.vue'
import { dateFormat } from '@/utils'

@Component({ components: { Drawer, CheckSwitch } })
export default class extends Vue {
  @Prop() keys: {
    date: string
    startTime: string
    endTime: string
  }
  private showDrawer = false
  @Watch('keys', { deep: true })
  onKeysChange(v) {
    if (!v.date) {
      const input: any = document.getElementById('date')
      input.blur()
      this.keys.date = dateFormat(Date.now(), 'yyyy-MM-dd')
    }
    if (!v.startTime) {
      const input: any = document.getElementById('startTime')
      input.blur()
      this.keys.startTime = '00:00:00'
    }
    if (!v.endTime) {
      const input: any = document.getElementById('endTime')
      input.blur()
      this.keys.endTime = '23:59:59'
    }
  }
  private submit() {
    this.showDrawer = false
    this.$emit('submit', this.keys)
  }
}
</script>

<style lang="less">
.DateBtn {
  position: fixed;
  top: 40px;
  right: 0;
  z-index: 1;
  height: 40px;
  line-height: 40px;
  width: 240px;
  border-radius: 20px 0 0 20px;
  color: #666;
  font-size: 32px;
  background: rgba(256, 256, 256, .8);
  box-shadow: 0 0 6px #ccc;
  text-align: center;
}
.SearchOptions {
  padding: 30px;
  font-size: 32px;
  color: #999;
  .item {
    display: flex;
    align-items: center;
    padding: 30px 10px;
    .split {
      margin: 0 20px;
    }
    button {
      line-height: 2;
    }
    .name {
      width: 150px;
      margin-right: 20px;
      text-align: right;
    }
    .checkboxs {
      label {
        margin-right: 20px;
      }
    }
    input {
      font-size: 32px;
      border: 1px solid;
      padding-left: 10px;
    }
  }
  .submit {
    color: #fff;
    margin: 50px auto 60px;
    width: 86vw;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: rgba(32, 193, 52, 1);
    border-radius: 10px;
  }
}
</style>
