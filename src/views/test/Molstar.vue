<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        Control
        <el-button @click="changeColor">changeColor</el-button>
        <el-button @click="clearAndLoad">clearAndLoad</el-button>
         <el-button @click="toggleSpin">toggleSpin</el-button>
      </el-col>

      <el-col :span="16">
        <div id="molstar_large"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
// require('pdbe-molstar/build/pdbe-molstar-plugin-3.1.0')
// var viewerInstance = new PDBeMolstarPlugin()
import { isPositionLocation } from "molstar/lib/mol-geo/util/location-iterator";
import { Vec3 } from "molstar/lib/mol-math/linear-algebra";
import { ColorTheme } from "molstar/lib/mol-theme/color";
import { ThemeDataContext } from "molstar/lib/mol-theme/theme";
import { Color } from "molstar/lib/mol-util/color";
import { ColorNames } from "molstar/lib/mol-util/color/names";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";

import { PluginCommands } from "molstar/lib/mol-plugin/commands";
export default {
  name: 'Molstar',

  data() {
    return {
      pdb: '',
      viewer: '',
    }
  },
  mounted() {
    // this.getPDB()
    this.molstar()
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

    changeColor() {
this.viewer.color({element: 'C'}, 'red')

// this.plugin.representation.structure.themes.colorThemeRegistry.add(
//       colorTheme
//     );

    
    },

    clearAndLoad(){
        this.viewer.plugin.clear()
         this.viewer.loadPdb('1GDT')
    },
    toggleSpin(){
        console.log(this.viewer.plugin)
        console.log(this.viewer)
        // debugger;
    },
    molstar() {
      if (this.viewer) {
      } else {
        this.$nextTick(function () {
          // Code that will run only after the
          // entire view has been re-rendered
          this.viewer = new Viewer('molstar_large', {
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
          this.viewer.loadPdb('7c7l')
          // viewer.loadEmdb('EMD-30210', { detail: 2})

          // viewer.loadStructureFromUrl(this.pdb, 'pdb')
          // console.log(this.pdb)
        })
      }
    },

    pdbe(url) {
      //Set options (Checkout available options list in the documentation)
      var options = {
        expanded: false,
        sequencePanel: true,
        customData: {
          url: url,
          format: 'cif',
        },
        moleculeId: this.job_name,
        alphafoldView: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [],
      }
      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById('molstar_large')
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