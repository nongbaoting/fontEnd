import Vue from 'vue'
// 全部导入element-ui
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

import axios from 'axios'
// 配置根路径
// import qs from 'qs'
// Vue.prototype.$qs = qs
// axios.defaults.baseURL = 'http://localhost:8989/protein/'
const apiUrl = 'http://222.200.186.47:8989/protein/' // 开发版本 dev
// const apiUrl = 'http://222.200.186.47:9090/protein/' // 发布版本, vue.config.js 也要改

Vue.prototype.API_URL = apiUrl
Vue.prototype.DATA_URL = 'http://222.200.186.47/'
axios.defaults.baseURL = apiUrl

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

