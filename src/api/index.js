import api from './api'
import request from './request'
const { post } = request
const appId = 'wxa283b98507d086ff'

export default {
  /** AUDIO - 录音分页列表 */
  deviceAudioRecordPage: (data = {}) => post(api.deviceAudioRecordPage, data),
  /** AUDIO - 录音文件下载 */
  deviceAudioRecordDown: (data = {}) => post(api.deviceAudioRecordDown, data),
  /** AUDIO - 录音文件删除 */
  deviceAudioRecordDel: (data = {}) => post(api.deviceAudioRecordDel, data),
  /** AUDIO - 录音标记 */
  deviceAudioRecordMark: (data = {}) => post(api.deviceAudioRecordMark, data),
  /** AUDIO - 录音请求 */
  deviceAudioRecordReq: (data = {}) => post(api.deviceAudioRecordReq, data),
  /** AUDIO - 统计新录音数 */
  deviceAudioRecordCountNew: (data = {}) => post(api.deviceAudioRecordCountNew, data),
  /** AUDIO - 统计未读录音数 */
  deviceAudioRecordCountUnread: (data = {}) => post(api.deviceAudioRecordCountUnread, data),
  /** DEVICE - 关机 */
  deviceShutdown: (data = {}) => post(api.deviceShutdown, data),
  /** DEVICE - 所有设备(简单信息) */
  deviceListSimple: (data = {}) => post(api.deviceListSimple, data),
  /** DEVICE - 所有设备(详细信息) */
  deviceAll: (data = {}) => post(api.deviceAll, data),
  /** DEVICE - 手动定位 */
  deviceRefreshGps: (data = {}) => post(api.deviceRefreshGps, data),
  /** DEVICE - 搜索设备 */
  deviceSearch: (data = {}) => post(api.deviceSearch, data),
  /** DEVICE - 更新设备信息 */
  deviceUpdate: (data = {}) => post(api.deviceUpdate, data),
  /** DEVICE - 电话呼叫 */
  deviceCall: (data = {}) => post(api.deviceCall, data),
  /** DEVICE - 设备信息 */
  deviceGet: (data = {}) => post(api.deviceGet, data),
  /** DEVICE - 设备列表(分页) */
  deviceList: (data = {}) => post(api.deviceList, data),
  /** DEVICE - 设备绑定 */
  deviceBind: (data = {}) => post(api.deviceBind, data),
  /** DEVICE - 设备解绑 */
  deviceUnBind: (data = {}) => post(api.deviceUnBind, data),
  /** DEVICE - 重启 */
  deviceRestart: (data = {}) => post(api.deviceRestart, data),
  /** FENCE - 删除电子围栏 */
  deviceFenceDel: (data = {}) => post(api.deviceFenceDel, data),
  /** FENCE - 更新电子围栏 */
  deviceFenceUpdate: (data = {}) => post(api.deviceFenceUpdate, data),
  /** FENCE - 添加围栏 */
  deviceFenceAdd: (data = {}) => post(api.deviceFenceAdd, data),
  /** FENCE - 电子围栏列表 */
  deviceFenceList: (data = {}) => post(api.deviceFenceList, data),
  /** FILE - 图片上传(jpg png格式，二进制流) */
  fileImgUpload: (data = {}) => post(api.fileImgUpload, data),
  /** NOTICE - 未读消息数 */
  noticeUnreadCount: (data = {}) => post(api.noticeUnreadCount, data),
  /** NOTICE - 通知列表 */
  noticeList: (data = {}) => post(api.noticeList, data),
  /** PAY - 充值列表 */
  payRechargeList: (data = {}) => post(api.payRechargeList, data),
  /** PAY - 充值列表 */
  payRechargeList: (data = {}) => post(api.payRechargeList, data),
  /** PAY - 微信支付 */
  payRechargePayWx: (data = {}) => post(api.payRechargePayWx, {appId, ...data}),
  /** PAY - 微信支付 */
  payRechargePayWx: (data = {}) => post(api.payRechargePayWx, data),
  /** PAY - 检查是否支付成功 */
  payRechargePayCheck: (data = {}) => post(api.payRechargePayCheck, data),
  /** PAY - 检查是否支付成功 */
  payRechargePayCheck: (data = {}) => post(api.payRechargePayCheck, data),
  /** SMS - 发送手机验证码 */
  smsSendCode: (data = {}) => post(api.smsSendCode, data),
  /** TRACK - 最后位置 */
  trackRecordLast: (data = {}) => post(api.trackRecordLast, data),
  /** TRACK - 轨迹列表 */
  trackRecordList: (data = {}) => post(api.trackRecordList, data),
  /** TRACK - 轨迹检查 */
  trackRecordCheck: (data = {}) => post(api.trackRecordCheck, data),
  /** USER - 小程序授权登陆 */
  userWxMiniappLogin: (data = {}) => post(api.userWxMiniappLogin,  {appid: appId, ...data}),
  /** USER - 手机动态码登陆 */
  userMobileLogin: (data = {}) => post(api.userMobileLogin, data),
  /** USER - 手机号码注册 */
  userMobileReg: (data = {}) => post(api.userMobileReg, data),
  /** USER - 更新推送token */
  userPushTokenUpdate: (data = {}) => post(api.userPushTokenUpdate, data),
  /** USER - 账号密码登陆 */
  userUserLogin: (data = {}) => post(api.userUserLogin, data),
  /** USER - 退出登录 */
  userLogout: (data = {}) => post(api.userLogout, data),
  /** VERSION - 版本检查 */
  versionCheck: (data = {}) => post(api.versionCheck, data)
}
