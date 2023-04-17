<template>
  <div >
    <el-row :gutter="10">
      <el-col  :offset="1" :span="11">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Sword" name="Sword">
            <sword-view  key="swordView" viewkey="swordView" @clickOnRcsb="focus_color_domain"></sword-view>  
          </el-tab-pane>
          <el-tab-pane label="InterproScan" name="InterproScan">
            <interproscan-view key="interproscan" viewkey="interproscan" @clickOnRcsb="focus_color_domain"></interproscan-view>
          </el-tab-pane>
          <el-tab-pane label="..." name="third">...</el-tab-pane>
        </el-tabs></el-col
      >
      <el-col :span="12">
        <el-tabs stretch v-model="activeRight" @tab-click="handleClick">
          <el-tab-pane label="3D Viewer" name="first">
            <el-row
              :gutter="20"
              type="flex"
              justify="space-around"
              class="viewerHead"
            >
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
          </el-tab-pane>
          <el-tab-pane label="Contact Map" name="second"
            >in development...</el-tab-pane
          >
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
require('pdbe-molstar/build/pdbe-molstar-plugin-1.2.1')
require('molstar/build/viewer/molstar.css')
import { RcsbFv } from '@rcsb/rcsb-saguaro'
import interproscan from "./domain/InterproScan.vue"
import Sword from "./domain/Sword.vue"
// require("https://cdn.jsdelivr.net/npm/@rcsb/rcsb-saguaro/build/rcsb-saguaro.js")
var viewerInstance = new PDBeMolstarPlugin()
export default {
    components:{
    "interproscan-view":interproscan,
    "sword-view":Sword
},
  data() {
    return {
      activeName: 'Sword',
      activeRight: 'first',
    }
  },
  mounted() {
    window.viewerInstance = viewerInstance

    this.pdbe()
   
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },

   
    focus_color_domain(e) {
      console.log('focus'+ e )
      viewerInstance.visual.select({
        data: [
          {
            struct_asym_id: 'C',
            start_residue_number: e.begin,
            end_residue_number: e.end,
            color: e.sourceId,
            focus: true,
          },
        ],
      })
    },
    
    pdbe() {
      //Set options (Checkout available options list in the documentation)
      var options = {
        // customData: {
        //   url: 'https://alphafold.ebi.ac.uk/files/AF-O15552-F1-model_v1.cif',
        //   format: 'cif',
        // },
        moleculeId: '1jx4',
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
<style scoped>
#mypfv {
  padding: 0;
  margin-left: 0;
}
#myViewer {
  float: left;
  width: 100%;
  height: 560px;
  position: relative;
}
.viewerHead {
  margin: 0px;
  padding-right: 20px;
}
.viewerSection {
  margin: 110px 0 10px 5px;
  padding: 0px;
}
.mycolor {
  /* color:rgb(39, 163, 180); #27A3B4 */
  /* color:rgb(192, 132, 35);#C08423 */
  /* color:{r:216,g:62,b:124} ;#D83E7C */
  /* color:rgb(27, 158, 119);#1B9E77 */
  color: rgb(117, 112, 179);
  color: rgb(231, 41, 138);
  color: rgb(152, 78, 163);
  color: rgb(217, 95, 95);
  color: rgb(102, 102, 30);
  color: rgb(230, 171, 2);
  color: rgb(166, 118, 29);
  color: rgb(228, 26, 28);
  color: rgb(55, 126, 184);
  color: rgb(77, 175, 74);
  color: rgb(166, 216, 84);
  color: rgb(104, 188, 0);
  color: rgb(102, 194, 165);
  color: rgb(102, 102, 102);
}
</style>