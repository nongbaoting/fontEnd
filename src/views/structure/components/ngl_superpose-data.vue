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
        <span>{{ input_name }}: </span>
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
        ></el-color-picker>
      </el-col>
    </el-row>
    <div style="border: 1px solid; height: 600px; margin-top: 10px; padding: 0">
      <div id="ngl_viewpoit" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
const NGL = require('ngl')
export default {
  props: ['input_filename', 'target_filename', 'input_name', 'target_name'],
  data() {
    return {
      input_color: '#13CE66', //green
      target_color: '#FF6347', // tomato
      input_url: '',
      target_url: '',
      stage: '',
    }
  },

  mounted() {
    this.load_ngl()
    this.create_input_url('input_pdb', this.input_filename)
    this.create_target_url('db_pdb', this.target_filename)
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    input_color: function (newQuestion, oldQuestion) {
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },
    target_color: function (newQuestion, oldQuestion) {
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },

    input_url: function (newQuestion, oldQuestion) {
      // this.input_url = this.DATA_URL + 'data/tmp/uploads/' + this.input_file
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },
    target_url: function (newQuestion, oldQuestion) {
      // this.target_url = this.DATA_URL + this.target_file
      console.log('watch this.target_url')
      console.log(this.target_url)
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },
  },
  methods: {
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
          url: 'api/similarity/getOneItem/',
          params: {
            dataType: dataType,
            fileName: fileName,
            input_pdb: this.input_filename,
            db_pdb: this.target_filename,
            uuid: this.$route.query.uuid,
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

    load_ngl() {
      var that = this
      var stage = new NGL.Stage('ngl_viewpoit', { backgroundColor: 'white' })
      // load a PDB structure and consume the returned `Promise`
      stage.removeAllComponents()
      Promise.all([
        stage
          .loadFile(that.input_url, { ext: 'pdb' })
          .then(function (component) {
            // add a "cartoon" representation to the structure component
            component.addRepresentation('cartoon', { color: that.input_color })
            // provide a "good" view of the structure
            component.autoView()
            return component
          }),

        stage
          .loadFile(that.target_url, { ext: 'pdb' })
          .then(function (component) {
            // add a "cartoon" representation to the structure component
            component.addRepresentation('cartoon', { color: that.target_color })
            // provide a "good" view of the structure
            component.autoView()
            return component
          }),
      ]).then(function (ol) {
        let s1 = ol[0].structure
        let s2 = ol[1].structure
        NGL.superpose(s1, s2, true)
        ol[0].updateRepresentations({ position: true })
        ol[0].autoView()
      })
      // Handle window resizing

      window.addEventListener(
        'resize',
        function (event) {
          stage.handleResize()
        },
        false
      )
      that.stage = stage
    },

    load_ngl_stage() {
      var that = this
      Promise.all([
        this.stage
          .loadFile(that.input_url, { ext: 'pdb' })
          .then(function (component) {
            // add a "cartoon" representation to the structure component
            component.addRepresentation('cartoon', { color: that.input_color })
            // provide a "good" view of the structure
            component.autoView()
            return component
          }),

        this.stage
          .loadFile(that.target_url, { ext: 'pdb' })
          .then(function (component) {
            // add a "cartoon" representation to the structure component
            component.addRepresentation('cartoon', { color: that.target_color })
            // provide a "good" view of the structure
            component.autoView()
            return component
          }),
      ]).then(function (ol) {
        let s1 = ol[0].structure
        let s2 = ol[1].structure
        // NGL.superpose(s1, s2, true)
        ol[0].updateRepresentations({ position: true })
        ol[0].autoView()
      })
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