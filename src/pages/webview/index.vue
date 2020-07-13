<template>
  <web-view :src="url"></web-view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    url: ''
  }),
  computed: {
    ...mapState(['imei'])
  },
  onLoad: function (options) {
    this.url = `${options.url}?token=${wx.getStorageSync('TOKEN')}&imei=${options.imei}&name=${options.name || ''}`
  }
}
</script>
