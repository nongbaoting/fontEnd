<template>
  <div class="view_region">
    <el-row class="panel_3d" :gutter="20">
      <el-col :span="16">
        <el-row>
          <span class="title">{{ title }}</span></el-row
        >
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
              v-for="(item, index) in models"
            >
            </el-tab-pane> </el-tabs
        ></el-row>
        <!-- 画图区 -->
        <el-row
          ><div :key="molstar_id" class="view_3d" :id="molstar_id"></div
        ></el-row>
        <el-row :gutter="20" class="view_link">
          <!-- 下载区 -->
          <el-col :span="3">
            <el-link
              class="download_link"
              :href="linkObj.baseURL + linkObj.tar_suffix"
              type="success"
              >Download
            </el-link>
          </el-col>
          <!-- 放大链接区 -->
          <el-col :span="8">
            <el-dropdown @command="viewLarger" placement="top-start">
              <span class="el-dropdown-link">
                ViewLarger<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="item"
                  v-for="(item, index) in models_rev"
                  >Model {{ models.length - index }}</el-dropdown-item
                >
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

export default {
  props: ['title', 'proj_name', 'molstar_id', 'models', 'linkObj'],
  data() {
    return {
      activeTab: this.models[0],
      tools: [],
    }
  },
  computed: {
    models_rev() {
      return this.models.slice().reverse()
    },
  },

  mounted() {
    this.$nextTick(function () {
      this.molstar()
    })
  },

  methods: {
    clickTab() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        // this.molstar()
        this.notice_tmp()
      })
    },
    notice_tmp() {
      this.$notify({
        title: '注意',
        message:
          '目前此页面只显示Model 1, 其余model 可以通过ViewLarger链接过去',
        type: 'warning',
      })
    },
    molstar() {
      var filename = this.linkObj.baseURL + this.activeTab
      // filename = 'http://222.200.186.47/outputs/testPDB/model_1.pdb'
      var viewer = new Viewer(this.molstar_id, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,

        viewportShowExpand: false,
        viewportShowSettings: false,
        // ViewportShowControl: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,

        // 'http://222.200.186.47/outputs/testPDB/AF-P04637-F1-model_v1.pdb.gz',
      })

      viewer.loadStructureFromUrl(filename, 'pdb')
    },

    viewLarger(command) {
      //   this.$message('click on item ' + command)
      let pdb = this.linkObj.baseURL + command

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
  padding-top: 20px;
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
  height: 450px;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>