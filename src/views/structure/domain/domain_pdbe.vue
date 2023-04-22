<template>
  <div >
    <el-row :gutter="10">
      <el-col  :offset="1" :span="11">
        <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tab-pane label="InterproScan" name="interproScan">
            <interproscan-view 
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
             key="interproscan" :viewkey="'interpro'+viewkey"   @clickOnRcsb="focus_color_domain"></interproscan-view>
          </el-tab-pane>
          <el-tab-pane label="Sword2" name="sword2">
            <sword2-view  key="sword2View" :viewkey="'sword2View'+viewkey" 
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
            @clickOnRcsb="focus_color_domain"></sword2-view>  
          </el-tab-pane>
         
          <el-tab-pane label="Unidoc" name="unidoc">
            <unidoc-view
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
             key="unidoc" :viewkey="'unidoc' + viewkey"   @clickOnRcsb="focus_color_domain"></unidoc-view>
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
import Interproscan from "./domain/InterproScan.vue"
import Sword2 from "./domain/Sword2.vue"
import Unidoc from "./domain/Unidoc.vue"
// require("https://cdn.jsdelivr.net/npm/@rcsb/rcsb-saguaro/build/rcsb-saguaro.js")
var viewerInstance = new PDBeMolstarPlugin()
export default {
    components:{
    "interproscan-view":Interproscan,
    "sword2-view":Sword2,
    "unidoc-view":Unidoc,

},
  data() {
    return {
      activeName: 'interproScan',
      activeRight: 'first',
      protein_id: this.$route.query.protein_id,
      request_Data_url: this.$route.query.request_Data_url,
      request_PDB_url: this.$route.query.request_PDB_url,
      viewkey_interpro: "interproscan" + this.$route.query.protein_id,
      viewkey: this.$route.query.protein_id + this.$route.query.request_Data_url
    }
  },
  mounted() {
    window.viewerInstance = viewerInstance

    this.getPDB()
   
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },

   
    focus_color_domain(e) {
      console.log('focus'+ e )
      console.log('focus'+ e.featureId )
      let color = e.color
       if (! e.color){
        color = e.sourceId
      }
      if (e.gaps){
        console.log(e.gaps)
        let domains = e.featureId.split('/')
        let data = []
        domains.forEach(dm => {
          let unit = dm.split('~')
          data.push({
            struct_asym_id: 'A',
            start_residue_number:  parseInt(unit[0]),
            end_residue_number: parseInt(unit[1]),
            color: color,
            
            focus: true,
          })
        });
        viewerInstance.visual.select({
        data: data,
      });
      }else{
        viewerInstance.visual.select({
        data: [
          {
            struct_asym_id: 'A',
            start_residue_number: e.begin,
            end_residue_number: e.end,
            color: color,
            focus: true,
          },
        ],
      });
      }
     
     
    },

  getPDB() {
      this.$http({
        url: this.request_PDB_url,
        params: {
          protein_id: this.$route.query.protein_id,
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
  color: #479c06 ;
  color:#C08423;
  color:#D83E7C;
color:#1B9E77;
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