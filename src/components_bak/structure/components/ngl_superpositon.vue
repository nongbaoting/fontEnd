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
        <span>{{ input }}: </span>
        <el-color-picker
          class="demonstration"
          v-model="input_color"
          size="small"
        ></el-color-picker>
      </el-col>
      <el-col class="c_text">
        <span>{{ target }}: </span
        ><el-color-picker
          class="demonstration"
          v-model="target_color"
          size="small"
        ></el-color-picker>
      </el-col>
    </el-row>
    <div style="border: 1px solid; height: 400px; margin-top: 10px; padding: 0">
      <div id="ngl_viewpoit" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
const NGL = require('ngl')
export default {
  props: ['input', 'target', 'input_file', 'target_source', 'target_file'],
  data() {
    return {
      input_color: '#13CE66', //green
      target_color: '#FF6347', // tomato
      input_url: this.DATA_URL + 'data/tmp/uploads/' + this.input_file,
      target_url: this.DATA_URL + this.target_file,
      stage: '',
    }
  },

  mounted() {
    this.load_ngl()
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

    input: function (newQuestion, oldQuestion) {
      this.input_url = this.DATA_URL + 'data/tmp/uploads/' + this.input_file
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },
    target: function (newQuestion, oldQuestion) {
      this.target_url = this.DATA_URL + this.target_file
      this.stage.removeAllComponents()
      this.load_ngl_stage()
    },
  },
  methods: {
    load_ngl() {
      var that = this
      var stage = new NGL.Stage('ngl_viewpoit', { backgroundColor: 'white' })
      // load a PDB structure and consume the returned `Promise`
      Promise.all([
        stage.loadFile(that.input_url).then(function (component) {
          // add a "cartoon" representation to the structure component
          component.addRepresentation('cartoon', { color: that.input_color })
          // provide a "good" view of the structure
          component.autoView()
          return component
        }),

        stage.loadFile(that.target_url).then(function (component) {
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
        this.stage.loadFile(that.input_url).then(function (component) {
          // add a "cartoon" representation to the structure component
          component.addRepresentation('cartoon', { color: that.input_color })
          // provide a "good" view of the structure
          component.autoView()
          return component
        }),

        this.stage.loadFile(that.target_url).then(function (component) {
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