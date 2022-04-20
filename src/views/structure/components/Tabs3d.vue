<template>
  <div class="view_region">
    <el-row class="panel_3d" :gutter="60">
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
        <el-row>
          <el-col></el-col>
          <div :key="molstar_id" class="view_3d" :id="molstar_id"></div
        ></el-row>
        <el-row :gutter="20" class="view_link">
          <!-- 下载区 -->
          <el-col :span="3">
            <el-link
              class="download_link"
              @click="Download(tarFileName)"
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
      <el-col :span="6" style="padding-top: 50px">
        <div>AlphaFold 2 Used templates!</div>
        <ol>
          <li v-for="item in templates">
            <el-link
              :href="
                'https://www.rcsb.org/structure/' +
                item.split('_')[0].toUpperCase()
              "
              target="_blank"
              type="success"
              >{{ item.toUpperCase() }}</el-link
            >
          </li>
        </ol>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'

export default {
  props: [
    'title',
    'proj_name',
    'molstar_id',
    'models',
    'program',
    'tarFileName',
  ],
  data() {
    return {
      activeTab: this.models[0],
      tools: [],
      viewer: '',
      templates: [],
    }
  },
  computed: {
    models_rev() {
      return this.models.slice().reverse()
    },
  },

  mounted() {
    this.notice_tmp()
    this.getTemplate()
    this.$nextTick(function () {
      this.getPDB(this.models[0])
    })
  },

  watch: {
    models: function (newModel, oldModel) {
      this.getPDB(this.models[0])
    },
  },

  methods: {
    clickTab() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        // this.molstar()
        // this.notice_tmp(this.activeTab)
        this.getPDB(this.activeTab)
      })
    },
    getTemplate() {
      this.$http({
        url: 'api/structure/getTemplate/',
        params: {
          program: this.program,
          job_name: this.proj_name,
        },
        method: 'GET',
      }).then((response) => {
        console.log(response)
        this.templates = response.data.templates
      })
    },

    getPDB(filename) {
      this.$http({
        url: 'api/structure/getFile/',
        params: {
          filetype: 'file',
          program: this.program,
          job_name: this.proj_name,
          filename: filename,
        },
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        this.molstar(url)
      })
    },
    Download(filename) {
      this.$http({
        url: 'api/structure/getFile/',
        params: {
          filetype: 'tar',
          program: this.program,
          job_name: this.proj_name,
          filename: filename,
        },
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/gz' })
        )
        link.download = this.tarFileName
        link.click()
        link.remove()
        window.URL.revokeObjectURL(link.href) //释放blob对象
      })
    },
    notice_tmp() {
      this.$notify({
        title: 'News',
        message: 'ViewLarger and Tabs is working',
        type: 'success',
        duration: 20 * 1000,
      })
    },
    molstar(url) {
      if (this.viewer) {
        this.viewer.plugin.clear()
        this.viewer.loadStructureFromUrl(url, 'pdb')
      } else {
        this.viewer = new Viewer(this.molstar_id, {
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: false,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          viewportShowExpand: true,
          viewportShowSettings: false,
          // ViewportShowControl: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false,
        })
        this.viewer.loadStructureFromUrl(url, 'pdb')
      }
    },

    viewLarger(command) {
      //   this.$message('click on item ' + command)
      let routeData = this.$router.resolve({
        path: '/molstar/',
        query: {
          filetype: 'file',
          program: this.program,
          job_name: this.proj_name,
          filename: command,
        },
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
  height: 600px;
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