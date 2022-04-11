import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import GLOBAL from "./assets/global.vue"
Vue.prototype.GLOBAL = GLOBAL

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
