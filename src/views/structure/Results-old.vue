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
    <el-row class="panel_3d" :gutter="20">
      <el-col :span="16">
        <el-row> <span class="title">AlphaFold</span></el-row>
        <el-row
          ><el-tabs
            v-model="activeTab"
            style="padding: 0"
            @tab-click="clickTab()"
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
        <el-row :gutter="20" class="view_link">
          <el-col :span="3">
            <el-link
              class="download_link"
              :href="
                alphafold_dir +
                proj_name +
                '/' +
                proj_name +
                '_alphafold.tar.gz'
              "
              type="success"
              >Download
            </el-link>
          </el-col>
          <el-col :span="8">
            <el-dropdown @command="viewLarger">
              <span class="el-dropdown-link">
                ViewLarger<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">Model 1</el-dropdown-item>
                <el-dropdown-item command="1">Model 2</el-dropdown-item>
                <el-dropdown-item command="2">Model 3</el-dropdown-item>
                <el-dropdown-item command="3">Model 4</el-dropdown-item>
                <el-dropdown-item command="4">Model 5</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'

const alphafold_dir = 'http://222.200.186.47/outputs/results/alphafold/'

export default {
  data() {
    return {
      proj_name: 'test',
      activeTab: 'model_af1',

      tools: [],
      models_af: [
        'model_af1',
        'model_af2',
        'model_af3',
        'model_af4',
        'model_af5',
      ],

      alphafold_dir: 'http://222.200.186.47/outputs/results/alphafold/',
      allFile_af: '.tar.gz',

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
    }
  },

  mounted() {
    this.$nextTick(function () {
      // this.getJob()
      this.proj_name = this.$route.query.proj_name
        ? this.$route.query.proj_name
        : 'Example'

      this.molstar()
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
    clickTab() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        this.molstar()
      })
    },

    molstar() {
      var filename = ''
      let item = this.activeTab
      filename =
        alphafold_dir +
        this.proj_name +
        '/' +
        this.proj_name +
        this.fileObj[item]
      // filename = 'http://222.200.186.47/outputs/testPDB/model_1.pdb'
      var viewer = new Viewer('molstar_alphafold', {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,

        viewportShowExpand: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,

        // 'http://222.200.186.47/outputs/testPDB/AF-P04637-F1-model_v1.pdb.gz',
      })

      viewer.loadStructureFromUrl(filename, 'pdb')
    },

    viewLarger(command) {
      this.$message('click on item ' + command)
      let pdb =
        'alphafold/' +
        this.proj_name +
        '/' +
        this.proj_name +
        '/ranked_' +
        command +
        '.pdb'
      let routeData = this.$router.resolve({
        path: '/molstar/',
        query: { pdb: pdb },
      })
      window.open(routeData.href, '_blank')
    },
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
  padding-top: 0px;
  margin-top: 0px;
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

.view_link {
  margin-top: 5px;
  margin-right: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>