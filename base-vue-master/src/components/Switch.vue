<template>
  <section class="model-15">
    <label class="switch">
      <input type="checkbox" v-model="checked"/>
      <span></span>
    </label>
  </section>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() value: boolean
  get checked () {
    return this.value
  }
  set checked (v) {
    this.$emit('input', v)
  }
}
</script>

<style lang="less">
.switch {
  width: 80px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
  display: inline-block;
  background: #ccc;
  box-shadow: 0 0 1px #36a6d4;
}
.switch input {
  visibility: hidden;
}
.switch span {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: #fff;
  width: 50%;
  height: 100%;
  transition: all linear 0.2s;
}
.switch span::before {
  position: absolute;
  top: 0;
  left: -100%;
  content: "";
  width: 200%;
  height: 100%;
  border-radius: 30px;
  background: rgba(32, 193, 52, 1);
}
.switch span::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
}
.switch input:checked + span {
  transform: translateX(100%);
}
</style>
