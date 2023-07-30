<template>
  <div class="container-big">
    <div id="domain_fix_header">
      <h5>Job Name: {{ job_name }}</h5>
    </div>
    <div class="container-big">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-tabs v-model="activeName" @tab-click="handleClickTab">
            <el-tab-pane label="Sequence" name="interproScan">
              <interproscan-view
                v-if="activeName == 'interproScan'"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                key="interproscan"
                :viewkey="'interpro' + viewkey"
                @clickOnRcsb="focus_color_domain"
              ></interproscan-view>
            </el-tab-pane>
            <el-tab-pane label="Structure" name="protvista">
              <protvista-custom
                v-if="activeName == 'protvista'"
                key="protvista"
                :viewkey="'protvista' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnPritvista="handleProtvistClick"
                @mouseOverPritvista="handle_mouseOverPritvista"
              ></protvista-custom>
            </el-tab-pane>

            <el-tab-pane class="annotation" name="ECOD">
              <span slot="label" class="annotation"> ECOD</span>

              <ecod-view
                v-if="activeName == 'ECOD'"
                key="ECOD"
                annoDBName="ECOD"
                :viewkey="'ECOD' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnFoldseekMatch="handleFoldseekMatch"
                @emitAlign="handleAlign"
              ></ecod-view>
            </el-tab-pane>

            <el-tab-pane class="annotation" name="SCOP">
              <span slot="label" class="annotation"> SCOP</span>

              <ecod-view
                v-if="activeName == 'SCOP'"
                key="SCOP"
                annoDBName="SCOP"
                :viewkey="'SCOP' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnFoldseekMatch="handleFoldseekMatch"
                @emitAlign="handleAlign"
              ></ecod-view>
            </el-tab-pane>

            <el-tab-pane class="annotation" name="CATH">
              <span slot="label" class="annotation"> CATH</span>
              <ecod-view
                v-if="activeName == 'CATH'"
                key="CATH"
                annoDBName="CATH"
                :viewkey="'CATH' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnFoldseekMatch="handleFoldseekMatch"
                @emitAlign="handleAlign"
              ></ecod-view>
            </el-tab-pane>

            <el-tab-pane class="annotation" name="AFDB">
              <span slot="label" class="annotationFull"> AlphaFoldDB</span>
              <AF-PDB-DB-view
                v-if="activeName == 'AFDB'"
                key="AFDB"
                annoDBName="AFDB"
                :viewkey="'AFDB' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnFoldseekMatch="handleFoldseekMatch"
                @emitAlign="handleAlign"
              ></AF-PDB-DB-view>
            </el-tab-pane>

            <el-tab-pane class="annotation" name="pdbDB">
              <span slot="label" class="annotationFull"> PDB-DB</span>
              <AF-PDB-DB-view
                v-if="activeName == 'pdbDB'"
                key="pdbDB"
                annoDBName="pdbDB"
                :viewkey="'pdbDB' + viewkey"
                :request_Data_url="request_Data_url"
                :protein_id="protein_id"
                @clickOnFoldseekMatch="handleFoldseekMatch"
                @emitAlign="handleAlign"
              ></AF-PDB-DB-view>
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
                  <span style="align: left"> PDBe Mol*</span>
                </el-col>
               
                  <el-dropdown @command="handleRepresentSelect">
                    <el-button type="primary" plain size="mini">
                      Representation<i
                        class="el-icon-arrow-down el-icon--right"
                      ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="cartoon"
                        >Cartoon</el-dropdown-item
                      >
                      <el-dropdown-item command="ball-and-stick"
                        >ball-and-stick</el-dropdown-item
                      >
                      <el-dropdown-item command="gaussian-surface"
                        >gaussian-surface</el-dropdown-item
                      >
                      <el-dropdown-item command="molecular-surface"
                        >molecular-surface</el-dropdown-item
                      >
                      <el-dropdown-item command="spacefill"
                        >spacefill</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                
                <el-dropdown @command="handleBgColorSelect">
                    <el-button type="primary" plain size="mini">
                      Background<i
                        class="el-icon-arrow-down el-icon--right"
                      ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="White"
                        >White</el-dropdown-item
                      >
                      <el-dropdown-item command="Black"
                        >Black</el-dropdown-item
                      >
                    
                    </el-dropdown-menu>
                  </el-dropdown>

             
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  onclick="viewerInstance.visual.toggleSpin()"
                  icon="el-icon-loading"
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
// import { RcsbFv } from '@rcsb/rcsb-saguaro'
import Interproscan from './domain/domainParsing/InterproScan.vue'
import Sword2 from './domain/domainParsing/Sword2.vue'
import Unidoc from './domain/domainParsing/Unidoc.vue'
import Protvista from './domain/Protvista-pdb.vue'
import Ecod from './domain/foldseek/ECOD.vue'
import AF_PDB_DB from './domain/foldseek/AF-PDB_DB.vue'
var viewerInstance = new PDBeMolstarPlugin()
export default {
  components: {
    'interproscan-view': Interproscan,
    'sword2-view': Sword2,
    'unidoc-view': Unidoc,
    'protvista-custom': Protvista,
    'ecod-view': Ecod,
    'AF-PDB-DB-view': AF_PDB_DB,
  },
  data() {
    return {
      activeName: 'ECOD',
      activeRight: 'first',
      job_name: this.$route.query.job_name,
      uuid: this.$route.query.uuid,
      protein_id: this.$route.query.uuid,
      chain: 'A',
      request_Data_url: 'protein/api/pdb_domain_annotations/parser_results/',
      request_PDB_url: 'protein/api/pdb_domain_annotations/get_pdbFile/',
      viewkey_interpro: 'interproscan' + this.$route.query.uuid,
      viewkey: this.$route.query.uuid,
      has_align: false,

      // option
      viewer_options: {},
     
    }
  },
  mounted() {
    window.viewerInstance = viewerInstance

    this.getPDB()
  },
  methods: {
    handleRepresentSelect(representation) {
      this.$message('click on item ' + representation)
      this.viewer_options.visualStyle = representation
       viewerInstance.visual.update(this.viewer_options)
    },
    handleBgColorSelect(command){
      if(command=="White") viewerInstance.canvas.setBgColor({r:255, g:255, b:255})
      if(command=="Black") viewerInstance.canvas.setBgColor({r:0, g:0, b:0})
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },

    handleProtvistClick(data) {
      let focusData = data.focus
      let fragments = data.fragments
      let domain_data = []
      fragments.forEach((dm) => {
        domain_data.push({
          struct_asym_id: this.chain,
          start_residue_number: dm.start,
          end_residue_number: dm.end,
          color: dm.color,
          focus: false,
        })
      })

      viewerInstance.visual.clearSelection()
      if (data.type == 'PPI') {
      }

      viewerInstance.visual.select({
        data: domain_data,
      })

      // focus
      let is_focus = data.type != 'PPI' ? true : false
      viewerInstance.visual.select({
        data: [
          {
            struct_asym_id: this.chain,
            start_residue_number: focusData.start,
            end_residue_number: focusData.end,
            color: focusData.color,
            focus: is_focus,
          },
        ],
      })
    },

    handle_mouseOverPritvista(data) {
      this.viewer_highlight(data)
    },

    viewer_highlight(e) {
      viewerInstance.visual.highlight({
        data: [
          {
            struct_asym_id: e.chain,
            start_residue_number: e.start,
            end_residue_number: e.end,
          },
        ],
      })
    },

    handleFoldseekMatch(e) {
      if (this.has_align || e.highlight) {
        this.viewer_highlight(e)
      } else {
        this.viewer_highlight(e)

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
        })
      }
    },
    handleAlign(data) {
      // this.pdbe(url)
      this.has_align = true
      var options = {
        customData: {
          url: data.url,
          format: 'pdb',
        },
        visualStyle: 'cartoon',
        // moleculeId: '1jx4',
        // alphafoldView: true,
        sequencePanel: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [],
      }
      this.viewer_options = options
      viewerInstance.visual.update(options)

      viewerInstance.visual.focus([
        {
          struct_asym_id: data.chain,
          start_residue_number: data.start,
          end_residue_number: data.end,
        },
      ])
    },

    focus_color_domain(e) {
      console.log(e)
      console.log('focus' + e.featureId)
      let color = e.color
      if (!e.color) {
        color = e.sourceId
      }
      if (e.gaps) {
        console.log(e.gaps)
        let domains = e.featureId.split('/')
        let data = []
        domains.forEach((dm) => {
          let unit = dm.split('~')
          data.push({
            struct_asym_id: this.chain,
            start_residue_number: parseInt(unit[0]),
            end_residue_number: parseInt(unit[1]),
            color: color,

            focus: true,
          })
        })
        viewerInstance.visual.select({
          data: data,
        })
      } else {
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
        })
      }
      viewerInstance.visual.reset({ camera: true })
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

    handleClickTab() {},
    pdbe(url) {
      //Set options (Checkout available options list in the documentation)
      var options = {
        customData: {
          url: url,
          format: 'pdb',
        },
        visualStyle: 'cartoon',
        // moleculeId: '1jx4',
        // alphafoldView: true,
        sequencePanel: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [],
      }
      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById('myViewer')
      //Call render method to display the 3D view
      this.viewer_options = options
      viewerInstance.render(viewerContainer, options)
    },
  },
}
</script>
<style scoped>
.container-big {
  padding-top: 5px;
  padding-left: 10px;
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
  color: #479c06;
}
#domain_fix_header {
  position: fixed;
  padding: 0;
  top: -15px;
  left: 40%;
  transform: translateX(-50%);
}

.annotation {
  /* background-color:coral; */
  font-weight: bold;
  color: coral;
  padding: 0px;
}

.annotationFull{
 font-weight: bold;
  color: salmon;
  padding: 0px;
}

.el-tab-pane {
}
</style>