<template>
  <div class="container-big">
    <div id="domain_fix_header"><h5>Job Name: {{job_name}}</h5></div>
    <div class="container-big">
 <el-row :gutter="10">
      <el-col :span="12">
        <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tab-pane label="Sequence" name="interproScan">
            <interproscan-view
            v-if="activeName=='interproScan'"
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
             key="interproscan" :viewkey="'interpro'+viewkey"   @clickOnRcsb="focus_color_domain"></interproscan-view>
          </el-tab-pane> 
          <el-tab-pane label="Structure" name="protvista">
            <protvista-custom  
            v-if="activeName=='protvista'"
            key="protvista" :viewkey="'protvista'+viewkey" 
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
            @clickOnRcsb="handleProtvistClick"></protvista-custom>  
          </el-tab-pane>

          <el-tab-pane label="ECOD" name="ECOD">
            <ecod-view  key="ECOD" :viewkey="'ECOD'+viewkey" 
            :request_Data_url="request_Data_url"
            :protein_id="protein_id"
            @clickOnFoldseekMatch="handleFoldseekMatch"></ecod-view>  
          </el-tab-pane>

          <!-- <el-tab-pane label="Sword2" name="sword2">
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
          </el-tab-pane> -->

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
   
  </div>
</template>
<script>
require('pdbe-molstar/build/pdbe-molstar-plugin-3.1.0')
require('molstar/build/viewer/molstar.css')
import { RcsbFv } from '@rcsb/rcsb-saguaro'
import Interproscan from "./domain/domainParsing/InterproScan.vue"
import Sword2 from "./domain/domainParsing/Sword2.vue"
import Unidoc from "./domain/domainParsing/Unidoc.vue"
import Protvista from "./domain/Protvista-pdb.vue"
import Ecod from "./domain/foldseek/ECOD.vue"
var viewerInstance = new PDBeMolstarPlugin()
export default {
    components:{
    "interproscan-view":Interproscan,
    "sword2-view":Sword2,
    "unidoc-view":Unidoc,
    "protvista-custom":Protvista,
    "ecod-view": Ecod,

},
  data() {
    return {
      activeName: 'ECOD',
      activeRight: 'first',
      job_name: this.$route.query.job_name,
      uuid: this.$route.query.uuid,
      protein_id: this.$route.query.uuid,
      chain: 'A',
      request_Data_url: "protein/api/pdb_domain_annotations/parser_results/",
      request_PDB_url: 'protein/api/pdb_domain_annotations/get_pdbFile/',
      viewkey_interpro: "interproscan" + this.$route.query.uuid,
      viewkey: this.$route.query.uuid 
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

    handleProtvistClick(data){
      let focusFragment = data.focus
      let fragments = data.fragments
      let domain_data = []
      fragments.forEach(dm => {
          domain_data.push({
            struct_asym_id: this.chain,
            start_residue_number:  dm.start,
            end_residue_number:dm.end,
            color: dm.color,
            focus: false,
          })
        });
        viewerInstance.visual.select({
        data: domain_data,
        })
      // focus

      viewerInstance.visual.select({
        data: [
          {
            struct_asym_id: this.chain,
            start_residue_number: focusFragment.start,
            end_residue_number: focusFragment.end,
            color: focusFragment.color,
            focus: true,
          },
        ],
      });

    },
   
    handleFoldseekMatch(e){
      // console.log(e)
      
      viewerInstance.visual.select({
        data: [
          {
            struct_asym_id: e.chain,
            start_residue_number: e.start,
            end_residue_number: e.end,
            color: e.color,
            focus: true,
          },
        ],
      });


    },

    focus_color_domain(e) {
      console.log(e )
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
            struct_asym_id: this.chain,
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
            struct_asym_id: this.chain,
            start_residue_number: e.begin,
            end_residue_number: e.end,
            color: color,
            focus: true,
          },
        ],
      });
      };
     viewerInstance.visual.reset({ camera: true});
     
    },

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
        hideCanvasControls: [
         
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
.container-big {
  padding-top:5px;
  padding-left:10px;;
  padding-right: 5px;
}
#mypfv {
  padding: 0;
  margin-left: 0;
}
#myViewer {
  float: left;
  width: 100%;
  height: 80vh;
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
  
}
#domain_fix_header{
  position: fixed;
  padding:0;
    top: -15px;
    left: 40%;
    transform: translateX(-50%);
}
</style>