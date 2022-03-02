import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import t_query from '../components/test/t_jquery.vue'

Vue.use(VueRouter)

// let head = document.getElementsByTagName('head');
// let meta = document.createElement('meta');
// meta.name = 'referrer';
// //根据实际情况修改referrer的值，可选值参考上文
// meta.content = 'no-referrer';
// head[0].appendChild(meta);

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/home' },

  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      // 嵌套再Home <router-view></router-view>
      { path: '/welcome', component: Welcome },
      {
        // 结构预测
        path: '/predict/structure/',
        component: resolve =>
          require(['../components/structure/Prediction.vue'], resolve)
      },
      {
        path: '/predict/structure/result/',
        component: resolve =>
          require(['../components/structure/Results.vue'], resolve)
      },
      {
        path: '/predict/structure/queue/',
        component: resolve =>
          require(['../components/structure/Queue.vue'], resolve)
      },

      {
        // 结构相似性
        path: '/structure_similarity/submit',
        component: resolve =>
          require(['../components/structure/similarity/SubmitPDB.vue'], resolve)
      },
      {
        path: '/structure_similarity/search',
        component: resolve =>
          require(['../components/structure/similarity/Search.vue'], resolve)
      },

      { path: '/home/test', component: t_query }
    ]
  },
  {
    path: '/molstar',
    component: resolve =>
      require(['../components/structure/Molstar.vue'], resolve)
  }
]

const router = new VueRouter({
  // mode: 'history',
  // 编译加base目录和Apache下的目录一致
  base: '/protein/',
  // base: '/protein2/',
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行 ， next()放行， next('/login')强制跳转
  // if (to.path === '/login') return next()
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router
