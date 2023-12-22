import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Base.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/Home.vue'
// import t_query from '../views/test/t_jquery.vue'

import DUF from "../views/structure/similarity/DUF.vue"

import Blast from "../views/blast/Blast.vue"
import BlastQueue from "../views/blast/Blast_Queue.vue"
import BlastRes from "../views/blast/Result.vue"
// import PSIBlastRes from "../views/blast/PSIBlast_Result.vue"
// import JackhmmerRes from "../views/blast/Jackhmmer_Result.vue"

// import pdbeMolstar from "../views/test/pdbeMolstar.vue"

import About from "../views/About.vue"
import Help from "../views/Help.vue"
import CDD from "../views/blast/cdd_submit.vue"
// import pairwiseAlignment from "../views/structure/similarity/pairwiseAlignment.vue"

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
    component: resolve => require(['../views/Base.vue'], resolve),
    redirect: '/welcome',
    children: [
      // 嵌套再Home <router-view></router-view>
      { path: '/welcome', component: Welcome },
      {
        // 结构预测
        path: '/predict/structure/',
        component: resolve =>
          require(['../views/structure/Prediction.vue'], resolve)
      },
      {
        // 结构预测
        path: '/predict/structure/2',
        component: resolve =>
          require(['../views/structure/prediction/Prediction.vue'], resolve)
      },
      {
        path: '/predict/structure/result/',
        component: resolve =>
          require(['../views/structure/Results.vue'], resolve)
      },
      {
        path: '/predict/structure/result/alignment',
        component: resolve =>
          require(['../views/structure/similarity/aligment_res.vue'], resolve)
      },
      {
        path: '/predict/structure/queue/',
        component: resolve =>
          require(['../views/structure/Queue.vue'], resolve)
      },

      // new structure prediction
      {
        path: '/predict/structure/result_new/',
        component: resolve =>
          require(['../views/structure/prediction/Results.vue'], resolve)
      },
     

      {
        // 结构相似性
        path: '/structure_similarity/submit',
        component: resolve =>
          require(['../views/structure/similarity/SubmitPDB.vue'], resolve)
      },
      {
        path: '/structure_similarity/search',
        component: resolve =>
          require(['../views/structure/similarity/Search.vue'], resolve)
      },
      { path: "/structure_similarity/pairwise_alignment", component: resovle => require(["../views/structure/similarity/pairwiseAlignment.vue"], resovle) },

      {
        path: '/structure_similarity/DUF',
        component: DUF
      },
      {
        path: '/structure_similarity/results',
        component: resolve => require(['../views/structure/similarity/Result.vue'], resolve)
      },
      {
        name: "plotSimilarStructure",
        path: '/structure_similarity/plot/',
        component: resolve => require(['../views/structure/similarity/plot.vue'], resolve)
      },

      //pdb  domain annotations
      {
        name: 'pdb_annotations',
        path: "/domain_annotation/pdb_annotations",
        component: resolve => require(['../views/structure/annotations/SubmitDomainAnnotations.vue'], resolve)
      },

      // 序列相似性 blast
      { path: "/sequence/blast", component: Blast },
      {
        path: "/sequence/blast/queue", component: BlastQueue

      },
      { path: "/sequence/blast/res/", component: BlastRes },
      { path: "/sequence/blast/res/psiblast", component: resolve => require(["../views/blast/PSIBlast_Result.vue"], resolve) },
      { path: "/sequence/blast/res/jackhmmer", component: resolve => require(["../views/blast/Jackhmmer_Result.vue"], resolve) },
      { path: "/sequence/blast/res/architectures", component: resolve => require(['../views/blast/components/archi.vue'], resolve) },

      { path: "/sequence/blast/cdd_submit", component: CDD },
      { path: "/sequence/blast/cdd_searchSave", component: resolve => require(['../views/blast/cdd_searchSave.vue'], resolve) },
      { path: "/sequence/blast/cdd_searchSave_result", component: resolve => require(['../views/blast/cdd_searchSave_Result.vue'], resolve) },
      //phylogenetics
      { path: "/phylogenetic/plot/", component: resolve => require(['../views/blast/phylogenetic.vue'], resolve) },

      //test
      {path: "/test/", component:resovle => require(['../views/test/test.vue'], resovle)},
      { path: "/test/pdbe-molstar", component: resovle => require(['../views/test/pdbeMolstar.vue'], resovle)},
      {
        path: "/test/svg-msa", component:resovle => require(['../views/test/t_jquery.vue'], resolve)
      },
      // 列队
      {
        path: "/queue", component: resolve =>
          require(['../views/Queue.vue'], resolve)
      },
      // help
      { path: "/About", component: About },
      {
        path: "/help", component: Help,
        children: [
          {
            path: '/sequence/blast/doc/psiblast', component: resolve =>
              require(['../views/doc/doc_psiblastParams'], resolve)
          },

          {
            path: '/sequence/blast/doc/jackhmmer', component: resolve =>
              require(['../views/doc/doc_jackhmmer.vue'], resolve)
          },
        ],
      },

      // CRISPR/CAS
      {
        path: '/crispr/browse',
        component: resolve => require(['../views/crispr/Browse.vue'], resolve)
      },

      {
        path: '/crispr/alginScore',
        component: resolve => require(['../views/crispr/AlignScore.vue'], resolve)
      },
      {
        path: '/crispr/cas12f1',
        component: resolve => require(['../views/crispr/Cas12f1.vue'], resolve)
      },
      { path: '/crispr/superposed', component: resolve => require(['../views/crispr/Superposed.vue'], resolve) },
      {
        path: '/crispr/alginScore/alignment',
        component: resolve =>
          require(['../views/crispr/AlignScore/aligment_res.vue'], resolve)
      },

      //results
      {
        path: '/results/tada_like/',
        component: resolve => require(['../views/results/tada_like.vue'],resolve)
      },
      {
        path: '/results/csr/',
        component: resolve => require(['../views/results/csr.vue'],resolve)
      },
      {
        path: '/results/RepeatDomain/',
        component: resolve => require(['../views/results/RepeatDomain.vue'],resolve)
      }


    ]
  },

   //pdb  domain annotations #1
   {
    name: 'annotationsResult',
    path: "/domain_annotation/annotationsResult",
    component: resolve => require(['../views/structure/annotations/AnnotationResult.vue'], resolve)
  },

  //molstar #1
  {
    path: '/pdbe-rcsb-domain',
    component: resolve => require(['../views/structure/domain/domain_pdbe.vue'], resolve)
  },
 //viewer local #1
 {
  path: '/pdb-viewer-local',
  component: resolve => require(['../views/structure/Viewer_local.vue'], resolve)
},
{
  path: '/predict/molstar/',
  component: resolve =>
    require(['../views/structure/prediction/Molstar.vue'], resolve)
},
  {
    path: '/molstar',
    component: resolve => require(['../views/structure/Molstar.vue'], resolve)
  },
  { path: '/crispr/molstar/', component: resolve => require(['../views/crispr/common/Molstar.vue'], resolve) }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行，next()放行， next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router
