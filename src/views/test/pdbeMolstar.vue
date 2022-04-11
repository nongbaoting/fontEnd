<template>
  <div>
    <h1>pdbe Molstar</h1>
    <h4>PDBe Mol* AlphaFold Demo</h4>
    <div class="viewerSection">
      <!-- Molstar container -->
      <div id="myViewer"></div>
    </div>
  </div>
</template>

<script>
require('pdbe-molstar/build/pdbe-molstar-plugin-1.2.1')
require('molstar/build/viewer/molstar.css')
export default {
  data() {
    return {}
  },

  mounted() {
    this.pdbe()
  },

  methods: {
    pdbe() {
      //Create plugin instance
      var viewerInstance = new PDBeMolstarPlugin()

      //Set options (Checkout available options list in the documentation)
      var options = {
        customData: {
          url: 'https://alphafold.ebi.ac.uk/files/AF-O15552-F1-model_v1.cif',
          format: 'cif',
        },
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
      var viewerContainer = document.getElementById('myViewer')

      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.msp-plugin ::-webkit-scrollbar-thumb {
  background-color: #474748 !important;
}
.viewerSection {
  margin: 120px 0 0 50px;
}
#myViewer {
  float: left;
  width: 400px;
  height: 400px;
  position: relative;
}
</style>