<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Watch('$route')
  onRouteChange(to) {
    document.title = to.meta.title
  }
}
</script>

<style lang="less">
@import '~@styles/atom.less';
@import '~@styles/icon.less';
#app {
  color: #999;
  font-size: 16px;
}
input[type="time"]::-webkit-clear-button {
  display: none;
}
input[type="time"]::-ms-clear {
  display: none;
}
input::-ms-clear {
    width: 0;
    height: 0;
}
/* Hide the cancel button */
::-webkit-search-cancel-button { 
    -webkit-appearance: none; 
}

/* Hide the magnifying glass */
::-webkit-search-results-button {
     -webkit-appearance: none; 
}

/* Remove the rounded corners */
input[type=search] { 
    -webkit-appearance: none; 
}
</style>
