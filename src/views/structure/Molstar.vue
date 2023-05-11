<template>
  <div>
    <div id="molstar_large"></div>
  </div>
</template>

<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
require('pdbe-molstar/build/pdbe-molstar-plugin-1.2.1')
var viewerInstance = new PDBeMolstarPlugin()

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
      this.$http({
        url: '/protein/api/structure/getFile/',
        params: {
          filetype: 'file',
          program: this.$route.query.program,
          job_name: this.$route.query.job_name,
          filename: this.$route.query.filename,
        },
        method: 'GET',
      }).then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        this.pdb = url
        // this.molstar()
        this.pdbe(url)
      })
    },
    
    molstar() {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        let viewer = new Viewer('molstar_large', {
          layoutIsExpanded: false,
          layoutShowControls: true,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: false,

          viewportShowExpand: true,
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

    pdbe(url) {
      //Set options (Checkout available options list in the documentation)
      var options = {
        expanded:false,
        customData: {
          url: url,
          format: 'cif',
        },
        // moleculeId: '1jx4',
        alphafoldView: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [
         
        ],
      }
      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById("molstar_large")
      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
    },

  },
}
</script>

<style  scoped>
#molstar_large {
 float: left;
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>