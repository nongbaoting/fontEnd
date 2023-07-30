<template>
  <div>
    <el-row :gutter="20" type="flex" justify="space-around" class="viewerHead">
      <el-col>
        <span style="align: left">Mol* Viewer</span>
      </el-col>
      <el-button
        type="primary"
        plain
        size="mini"
        onclick="viewerInstance.canvas.setBgColor({r:255, g:255, b:255})"
        >Background:White</el-button
      >
      <el-button
        type="primary"
        plain
        size="mini"
        onclick="viewerInstance.canvas.setBgColor({r:0, g:0, b:0})"
        >Background:Black</el-button
      >
      <el-button
        type="primary"
        plain
        size="mini"
        onclick="viewerInstance.visual.toggleSpin()"
        icon="el-icon-loading
"
        >Toggle Spin</el-button
      >
      <el-button
        size="mini"
        onclick="viewerInstance.canvas.setBgColor({r:255, g:255, b:255});viewerInstance.visual.reset({ camera: true, theme: true, highlightColor: true, selectColor: true }); viewerInstance.visual.clearSelection();"
        >Reset</el-button
      >
    </el-row>
    <el-row
      ><div class="viewerSection">
        <!-- Molstar container -->
        <div id="myViewer"></div></div
    ></el-row>
  </div>
</template>

<script>
require('pdbe-molstar/build/pdbe-molstar-plugin-3.1.0')
require('molstar/build/viewer/molstar.css')
var viewerInstance = new PDBeMolstarPlugin()

export default {
  data() {
    return {}
  },
  mounted() {
    window.viewerInstance = viewerInstance
  },
  methods: {
    getPDB() {
      this.$http({
        url: this.request_PDB_url,
        params: {
          uuid: this.$route.query.uuid,
        },
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        this.pdbe(url)
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
        // alphafoldView: true,
        sequencePanel: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [],
      }
      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById('myViewer')
      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
    },
  },
}
</script>

<style>
</style>