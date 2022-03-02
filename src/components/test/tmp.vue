<template>
  <div class="view_region">
    <el-row>
      <p>
        Job Name:
        {{
          this.$route.query.proj_name ? this.$route.query.proj_name : 'Example'
        }}
      </p>
    </el-row>

    <el-row
      class="panel_3d"
      :gutter="20"
      v-if="tools.indexOf('AlphaFold 2') !== -1"
    >
      <el-col :span="16">
        <el-row> <span class="title">AlphaFold</span></el-row>
        <el-row
          ><el-tabs
            v-model="activeTab_af"
            style="padding: 0"
            @tab-click="handleClick_af('molstar_alphafold')"
          >
            <el-tab-pane
              :name="item"
              :label="'Model ' + (index + 1)"
              :key="item"
              v-for="(item, index) in models_af"
            >
            </el-tab-pane>
            <!-- 下载区 -->
          </el-tabs></el-row
        >
        <!-- 画图区 -->
        <el-row><div class="view_3d" id="molstar_alphafold"></div></el-row>
        <el-link
          class="download_link"
          :href="
            alphafold_dir + proj_name + '/' + proj_name + '_alphafold.tar.gz'
          "
          type="success"
          >Download
        </el-link>
        <el-link
          class="download_link"
          :href="
            alphafold_dir + proj_name + '/' + proj_name + '_alphafold.tar.gz'
          "
          type="success"
          >ViewLarger
        </el-link>
      </el-col>
    </el-row>

    <!-- <el-divider style="margin-top: 40px"></el-divider> -->
    <el-row class="panel_3d" v-if="tools.indexOf('RoseTTAFold') !== -1">
      <el-col :span="16">
        <span class="title">RoseTTAFold</span>
        <!-- 画图区 -->
        <el-tabs v-model="activeTab_rt" @tab-click="handleClick_rt">
          <el-tab-pane
            :name="item"
            :label="'Model ' + (index + 1)"
            :key="item"
            v-for="(item, index) in models_rt"
            :lazy="true"
          >
            <div class="view_3d" :id="item"></div>
          </el-tab-pane>
          <!-- 下载区 -->
          <el-link
            :href="
              roseTTAFold_dir +
              proj_name +
              '/' +
              proj_name +
              '_roseTTAFold.tar.gz'
            "
            type="success"
            >Download</el-link
          >
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
var view_3d = {
  props: ['view_id'],
  template: `<div :id=" view_id" style="height: 400px; width: 100%"></div>`,
}

var NGL = require('ngl')

import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'

const alphafold_dir = 'http://222.200.186.47/outputs/results/alphafold/'
const roseTTAFold_dir = 'http://222.200.186.47/outputs/results/roseTTAFold/'
export default {
  data() {
    return {
      proj_name: 'test',
      activeTab_af: 'model_af1',
      activeTab_rt: 'model_rt1',
      tools: [],
      models_af: [
        'model_af1',
        'model_af2',
        'model_af3',
        'model_af4',
        'model_af5',
      ],
      models_rt: [
        'model_rt1',
        'model_rt2',
        'model_rt3',
        'model_rt4',
        'model_rt5',
      ],
      alphafold_dir: 'http://222.200.186.47/outputs/results/alphafold/',
      roseTTAFold_dir: 'http://222.200.186.47/outputs/results/roseTTAFold/',
      allFile_af: '.tar.gz',
      allFile_rt: '.tar.gz',

      fileObj: {
        model_af1: '/ranked_0.pdb',
        model_af2: '/ranked_1.pdb',
        model_af3: '/ranked_2.pdb',
        model_af4: '/ranked_3.pdb',
        model_af5: '/ranked_4.pdb',
        model_rt1: '/model/model_1.pdb',
        model_rt2: '/model/model_2.pdb',
        model_rt3: '/model/model_3.pdb',
        model_rt4: '/model/model_4.pdb',
        model_rt5: '/model/model_5.pdb',
      },
      stages: {
        model_rt1: '',
        model_rt2: '',
      },
    }
  },

  created() {
    this.getJob()
  },

  mounted() {
    this.$nextTick(function () {
      // this.getJob()
      this.proj_name = this.$route.query.proj_name
        ? this.$route.query.proj_name
        : 'Example'
      if (this.tools.indexOf('AlphaFold 2') !== -1) {
        console.log('load af')
        this.ngl_view('molstar_alphafold')
      } else {
        console.log('notlll')
        console.log(this.tools)
      }
      if (this.tools.indexOf('RoseTTAFold') !== -1) {
        console.log('load rt')
        this.ngl_view('model_rt1')
      }

      // this.ngl_view('model_rt2')
      // this.ngl_view('model_rt2')
    })
  },

  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.proj_name = this.$route.query.proj_name
        ? this.$route.query.proj_name
        : 'Example'
    })
  },
  // watch: {
  //   proj_name: function (newProjName, oldProjName) {
  //     this.ngl_view(this.activeTab_af)
  //     this.ngl_view(this.activeTab_rt)
  //   },
  // },
  methods: {
    getJob() {
      this.$http
        .get('api/structure/search/', {
          params: {
            searchType: 'job_name_id',
            searchContent: this.$route.query.proj_name,
          },
        })
        .then((res) => {
          let data = JSON.parse(res.data)
          let tools = data[0].fields.tools.toString().split(',')
          this.tools = tools
          console.log(this.tools)
        })
    },
    handleClick_af() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        this.ngl_view('molstar_alphafold')
      })
    },

    handleClick_rt: function (tab, event) {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        this.ngl_view(this.activeTab_rt)
      })
    },

    ngl_view(app_id) {
      // create a `stage` object
      // this.$message.success(item)
      var filename = ''
      let item = this.activeTab_af
      if (this.models_af.indexOf(item) !== -1) {
        filename =
          alphafold_dir +
          this.proj_name +
          '/' +
          this.proj_name +
          this.fileObj[item]
      } else if (this.models_rt.indexOf(item) !== -1) {
        filename =
          roseTTAFold_dir +
          this.proj_name +
          '/' +
          this.proj_name +
          this.fileObj[item]
      }

      var viewer = new Viewer(app_id, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,

        viewportShowExpand: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,

        // pdbProvider: 'rcsb',
        // emdbProvider: 'rcsb',
        // structureUrl:
        // 'http://222.200.186.47/outputs/testPDB/AF-P04637-F1-model_v1.pdb.gz',
      })
      // viewer.loadPdb('7bv2')
      // viewer.loadEmdb('EMD-30210', { detail: 6 })
      viewer.loadStructureFromUrl(filename, 'pdb')
      // // this.$message.success(filename)
      // let stage = new NGL.Stage(item)
      // // load a PDB structure and consume the returned `Promise`
      // stage.loadFile(filename).then(function (o) {
      //   // add a "cartoon" representation to the structure component
      //   // 0.addRepresentation("cartoon");
      //   o.addRepresentation('cartoon', { color: 'chainid' })
      //   // provide a "good" view of the structure
      //   o.autoView()
      // })
      // stage.handleResize()
    },
  },

  components: {
    'view-3d': view_3d,
  },
}
</script>

<style lang="less" scoped>
.view_region {
  padding-top: 10px;
  padding-left: 10px;

  .title {
    display: flex;
    text-align: center;
    justify-content: left;
  }
}
.panel_3d {
  padding-top: 20px;
}

.el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}

.el-tabs {
  padding: 0px;

  .content {
    height: 100%;
    width: 100%;
    padding: 0px;
  }
}

.view_3d {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.download_link {
  margin-right: 20px;
  margin-top: 5px;
}
</style>