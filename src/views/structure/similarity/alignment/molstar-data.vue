<template>
  <div>
    <el-row
      :gutter="20"
      type="flex"
      justify="start"
      align="top"
      class="head_row"
    >
      <el-col class="c_text" :span="8" :offset="1">
        <!-- <span>{{ input_name }}: </span>
        <el-color-picker
          class="demonstration"
          v-model="input_color"
          size="small"
        ></el-color-picker>
      </el-col>
      <el-col class="c_text">
        <span>{{ target_name }}: </span
        ><el-color-picker
          class="demonstration"
          v-model="target_color"
          size="small"
        ></el-color-picker> -->
        <div style="height: 600px; margin-top: 10px; padding: 0">
          <div :id="molstar_id" style="width: 100%; height: 100%"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const NGL = require('ngl')
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
export default {
  props: [
    'input_filename',
    'target_filename',
    'input_name',
    'target_name',
    'align_url',
  ],
  data() {
    return {
      input_color: '#13CE66', //green
      target_color: '#FF6347', // tomato
      input_url: '',
      target_url: '',
      stage: '',
      molstar_id: 'molstar_viewpoit_tmalign',
      view: false,
      viewer: '',
    }
  },

  mounted() {
    // this.load_ngl()
    this.downloadFi_and_view()
  },
  // watch: {
  //   // 如果 `question` 发生改变，这个函数就会运行
  //   input_color: function (newQuestion, oldQuestion) {
  //     this.stage.removeAllComponents()
  //     this.load_ngl_stage()
  //   },
  //   target_color: function (newQuestion, oldQuestion) {
  //     this.stage.removeAllComponents()
  //     this.load_ngl_stage()
  //   },
  // },
  methods: {
    downloadFi_and_view() {
      this.create_input_url('input_pdb', this.input_filename)

      // this.stage.removeAllComponents()
      // this.load_ngl_stage()
    },

    create_input_url(dataType, fileName) {
      this.previewDownFile(dataType, fileName).then((v) => {
        if (v.status == 200) {
          const binaryData = []
          binaryData.push(v.data)
          let myurl = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'text/plain' })
          )
          console.log('myurl')
          console.log(myurl)
          this.input_url = myurl
          this.molstar(myurl)
          this.create_target_url('db_pdb', this.target_filename)
        } else {
          this.$message.error('请求错误！')
        }
      })
    },

    create_target_url(dataType, fileName) {
      this.previewDownFile(dataType, fileName).then((v) => {
        if (v.status == 200) {
          const binaryData = []
          binaryData.push(v.data)
          let myurl = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'text/plain' })
          )
          console.log('myurl')
          console.log(myurl)
          this.target_url = myurl
          this.molstar(myurl)
          return myurl
        } else {
          this.$message.error('请求错误！')
        }
      })
    },

    previewDownFile(dataType, fileName) {
      let that = this
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.align_url,
          params: {
            dataType: dataType,
            fileName: fileName,
            db_pdbid: this.$route.query.pdbid,
            db_chain: this.$route.query.chain,
            input_pdb: this.input_filename,
            db_pdb: this.target_filename,
            uuid: this.$route.query.proj_name,
            viewer: '',
          },
          timeout: 0,
          method: 'get',
          responseType: 'blob',
          header: { 'Content-Type': 'multipart/form-data' },
        })
          .then((res) => {
            resolve(res)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },

    molstar(url) {
      if (this.viewer) {
        // this.viewer.plugin.clear()
        this.viewer.loadStructureFromUrl(url, 'pdb')
      } else {
        this.viewer = new Viewer(this.molstar_id, {
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          viewportShowExpand: true,
          viewportShowSettings: true,
          ViewportShowControl: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false,
        })
        this.viewer.loadStructureFromUrl(url, 'pdb')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.demonstration {
  padding-left: 10px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
.c_text {
  padding: 0px;
  align-items: center;
  //   text-align: center;
  display: flex;
}
</style>