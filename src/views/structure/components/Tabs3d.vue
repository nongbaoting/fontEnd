<template>
  <div class="view_region">
    <el-row class="panel_3d" :gutter="60">
      <el-col :span="14">
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
          <div :key="molstar_id" class="view_3d" :id="molstar_id"></div>
         <!-- <div key="molstar_pdbe" class="view_3d" id="molstar_pdbe"></div> -->
         </el-row>
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
        <div class="box">
          If you do not find any results, it is likely that your input sequences
          contain non-standard residues. Try:
          <el-link type="primary" @click="use_unrelaxed">
            Use unrelaxed model</el-link
          >
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <h3>AlphaFold 2 Used templates!</h3>
      <el-col :span="20" style="padding: 30px">
        <el-table :data="template_data">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="CODEID" label="ID" width="100">
            <template slot-scope="scope">
              <el-link
                :href="'https://www.rcsb.org/structure/' + scope.row.CODEID"
                target="_blank"
                type="primary"
                style="font-size: 18px"
                >{{ scope.row.CODEID }} {{scope.row.Chain}}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="HEADER"
            label="HEADER"
            width="200"
          ></el-table-column>
          <el-table-column prop="COMPOUND" label="COMPOUND"></el-table-column>
          <el-table-column label="Alignment" width="150">
            <template slot-scope="scope">
              <el-link
                @click="toAlignment(scope.row.CODEID, scope.row.Chain)"
                target="_blank"
                type="success"
              >
                Alignment
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
require('pdbe-molstar/build/pdbe-molstar-plugin-1.2.1')
var viewerInstance = new PDBeMolstarPlugin()
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
      model_af_unrelaxed: ['unrelaxed_model_1.pdb'],
      template_data: [],
    }
  },
  computed: {
    models_rev() {
      return this.models.slice().reverse()
    },
  },

  mounted() {
    // this.notice_tmp()
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
    use_unrelaxed() {
      this.models = this.model_af_unrelaxed
    },

    getTemplate() {
      this.$http({
        url: '/protein/api/structure/getTemplate/',
        params: {
          program: this.program,
          job_name: this.proj_name,
        },
        method: 'GET',
      }).then((response) => {
        console.log(response)
        this.template_data = response.data.data
      })
    },

    getPDB(filename) {
      this.$http({
        url: '/protein/api/structure/getFile/',
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
        // this.molstar(url)
        this.pdbe(url)
      })
    },
    Download(filename) {
      this.$http({
        url: '/protein/api/structure/getFile/',
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
    pdbe(url) {
      //Set options (Checkout available options list in the documentation)
      var options = {
        customData: {
          url: url,
          format: 'pdb',
        },
        // moleculeId: '1jx4',
        alphafoldView: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [
          'selection',
          'animation',
          'controlToggle',
          'controlInfo',
        ],
      }
      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById('molstar_pdbe')
      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
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

    toAlignment(pdbid, chain) {
      let routeData = this.$router.resolve({
        path: '/predict/structure/result/alignment',
        query: {
          pdbid: pdbid,
          chain: chain,
          proj_name: this.proj_name,
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