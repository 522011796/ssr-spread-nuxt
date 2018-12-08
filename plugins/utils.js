import Vue from 'vue'
import utils from '../utils/utils'

export default ({ app, store, req }) => {
  //时间格式化插件
  Vue.prototype.$utils = utils;
}
