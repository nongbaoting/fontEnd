import Vue from 'vue'
// 全部导入element-ui
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

import axios from 'axios'
// 配置根路径
axios.defaults.timeout = 10 * 60 * 1000; // 30s
const apiUrl = 'http://172.22.148.191:9002' //   开发版本 dev 链接Django
// const apiUrl = 'http://172.22.148.191:3389' // 发布版本
// const apiUrl = 'http://biomed.nscc-gz.cn/server/PROTsim/' // 发布版本 超算

Vue.prototype.API_URL = apiUrl
Vue.prototype.DATA_URL = 'http://172.22.148.150/'
axios.defaults.baseURL = apiUrl

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

