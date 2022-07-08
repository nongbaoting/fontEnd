<template>
  <div>
    <div id="molstar_large_cripsr"></div>
  </div>
</template>

<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
export default {
  name: 'Molstar',

  data() {
    return {
      pdb: '',
    }
  },
  mounted() {
    this.getPDB()
  },

  methods: {
    getPDB() {
      console.log(this.$route.query.filename)
      this.$http({
        url: '/crispr/api/structure/getFile/',
        params: {
          filetype: 'file',
          filename: this.$route.query.filename,
        },
        method: 'GET',
      }).then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        this.pdb = url
        this.molstar()
        // this.pdbe()
      })
    },
    pdbe() {
      //Create plugin instance
      var viewerInstance = new PDBeMolstarPlugin()

      //Set options (Checkout available options list in the documentation)
      var options = {
        customData: {
          url: this.pdb,
          format: 'pdb',
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
      var viewerContainer = document.getElementById('molstar_large_cripsr')

      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
    },
    molstar() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        let viewer = new Viewer('molstar_large_cripsr', {
          layoutIsExpanded: false,
          layoutShowControls: true,
          layoutShowRemoteState: true,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: false,

          viewportShowExpand: false,
          viewportShowSelectionMode: true,
          viewportShowAnimation: true,
          // 'http://222.200.186.47/outputs/testPDB/AF-P04637-F1-model_v1.pdb.gz',
        })
        // viewer.loadPdb('7bv2')
        // viewer.loadEmdb('EMD-30210', { detail: 6 })

        viewer.loadStructureFromUrl(this.pdb, 'pdb')
        console.log(this.pdb)
      })
    },
  },
}
</script>

<style  scoped>
#molstar_large {
  width: 100%;
  height: 100%;
}
</style>