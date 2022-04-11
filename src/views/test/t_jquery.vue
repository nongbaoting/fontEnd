<template>
  <div>
    <!-- <div id="viewport" style="width: 400px; height: 300px"></div> -->
    <div style="height: 1200px; width: 800px" id="molstar"></div>
    <div style="height: 400px; width: 400px" id="molstar_1"></div>
    <div id="container-01" class="mol-container"></div>
    <el-button type="info" @click="toggleCanvas">toggle</el-button>
    <canvas
      id="myCanvas"
      width="200"
      height="100"
      style="border: 1px solid #000000"
      v-if="isShow"
    >
    </canvas>
  </div>
</template>

<script>
// import $ from "jquery";

const NGL = require('ngl')
export default {
  data() {
    return {
      node: {},
      isShow: true,
    }
  },
  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.add_colors()
    })
  },
  mounted() {
    // this.test()
    this.molstar('molstar')
    this.molstar('molstar_1')
    this.add_colors()
  },
  methods: {
    add_colors() {
      var c = document.getElementById('myCanvas')
      var ctx = c.getContext('2d')
      ctx.fillStyle = '#FF0000'
      ctx.fillRect(0, 0, 150, 75)
    },
    toggleCanvas() {
      this.isShow = !this.isShow
    },
    test() {
      console.log(NGL)
      // create a `stage` object
      var stage = new NGL.Stage('viewport')
      // load a PDB structure and consume the returned `Promise`
      stage.loadFile('rcsb://1CRN').then(function (component) {
        // add a "cartoon" representation to the structure component
        component.addRepresentation('cartoon')
        // provide a "good" view of the structure
        component.autoView()
      })
    },
    molstar(app_id) {
      var viewer = new this.$molstar(app_id, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: true,
        layoutShowLog: false,
        layoutShowLeftPanel: true,

        viewportShowExpand: true,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,

        pdbProvider: 'rcsb',
        emdbProvider: 'rcsb',
      })
      viewer.loadPdb('7bv2')
      // viewer.loadEmdb('EMD-30210', { detail: 6 });
    },
  },
}
</script>

<style>
#bpp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  border: 1px solid red;
}
</style>