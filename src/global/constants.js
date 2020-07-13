/** 地图类型 */
export const MAP_TYPE = {
  standard: '标准地图',
  satellite: '卫星地图'
}

const webviewPath = '/pages/webview/main'
// const h5Host = 'http://192.168.0.2:8080'
const h5Host =  'https://gps.suogong.net/gpstrackanimation'
export const H5 = {
  getTrackPath: imei => `${webviewPath}?url=${h5Host}/#/&imei=${imei}`,
  getPosPath: (imei, name) => `${webviewPath}?url=${h5Host}/#/pos&imei=${imei}&name=${name}`
}
