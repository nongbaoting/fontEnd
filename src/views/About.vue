<template>
  <div>
    <el-row  :gutter="20">
      <!-- <el-col :span="4">
        <h5 class="subhead"><b>ABOUT</b></h5>
        <el-menu
         
          :default-active="activePath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
             <span class="headtext" slot="title">Input</span>
           
    
          </el-menu-item>
          
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span class="headtext" slot="title">Result</span>
          </el-menu-item>
        </el-menu>
      </el-col> -->
      <el-col :span="18" :offset="3">
          <div>
            <h2>About</h2>
            <div>

                    PISA is an interactive web server for protein annotation that utilizes a 
               suite of AI-based tools to predict protein domains, intrinsically disordered regions (IDRs),
                PPI sites, DNA binding sites, RNA binding sites, post-translational modification sites, 
                and metal ion binding sites. PISA aligns the uploaded structure against four structural 
                databases (Protein Data Bank, ECOD, SCOP, and AlphaFold DB) to identify 
                structurally similar proteins. By integrating the protein sequence viewer ProtVista, 
                the 3D viewer PDBe Mol*, and custom JavaScript code, users can explore and visualize 
                proteins of interest. Additionally, PISA is also available as a Docker image, 
                enabling easy local installation.
            </div>
          </div>
          <div>
            <h2>Submit</h2>
            <div>
              Parameters:
            </div>
            <ul>
            <li><b>Upload File: </b>Upload a file in PDB format, usually predicted by tools like AlphaFold, RoseTTAFold, ESMFold, and others.</li>
            <li><b>Chain: </b>The chain to be used for annotation. Currently, PISA can only annotate one 
            chain at a time. The default is chain <b>A</b>, which is the same as most structure prediction software
             generates for monomeric protein structures.
            </li>
            <li><b>Job Name:</b> Optional, but if provided, it will appear at the top of the result page</li>
            </ul>
            <img  src="../assets/figs/upload.jpg" class="center">
           
          </div>
          <div>
            <h2>Result</h2>

            <p>The result page consists of two main panels. The left panel contains the information of the annotation results,
               while the right panel presents the 3D viewer.</p>
            <p>At the top of the left panel, 5 tabs divide the information into <b>InterproScan</b>, <b>AI</b>, and  <b>Alignment</b> 
              (ECOD, SCOP, AlphaFoldDB, PDB-DB) sections.</b>
            </p>
            <img width="100%" src="../assets/figs/result_panel.png" alt="Result Panel" srcset="">
            
              
            <li>The InterProScan Tab displays the annotation results from InterProScan, 
              organized into categories such as superfamilies, families, domains, conserved sites, and others.</li>
            <li>The AI Tab contains annotation results predicted by various deep learning tools. 
              It includes SWORD2 and Uidoc for domain prediction and partitioning, 
              flDPnn for intrinsically disordered region (IDR) prediction,
               ScanNet for protein-protein binding site prediction, 
               CLAPE for DNA, RNA, and protein binding site prediction, 
               MusiteDeep for post-translational modification site prediction, 
               and LMetalSite for metal ion (Zn, Ca, Mg, Mn) binding site prediction.
            </li>

            <li>The Alignment Tab contains the alignment results of the input structure against various 
              structure databases (ECOD, SCOP, AlphaFoldDB, PDB-DB) using Foldseek. The alignment results consist of 
              two subtabs: Table and Subject Distribution. The Table subtab displays the alignment results in a tabular
               format, while the Subject Distribution subtab shows the mapping of subject sequences 
               onto the query sequence.  
            </li>
            
            <img width="100%" src="../assets/figs/alignemnt_highlight.png" alt="alignemnt_highlight" srcset="">
            
            The Subject Distribution subtab shows the mapping of subject sequences onto the query sequence.
            <img width="100%" src="../assets/figs/alignemnt_subject.png"  srcset="">
            
            Users can perform a structural alignment (TMalign) between similar structures and their uploaded structure, 
              and the superimposed structures are displayed on the PDBe Mol* viewer.
            <img width="100%" src="../assets/figs/alignemnt_TMalign.png" srcset="">
          </div>
          <div>
            <h2>Contact</h2>
            <div style="padding-bottom:40px"><p>
              If you have any questions or suggestions, please feel free to contact us by email at nong55@foxmail.com or open a new issue on <a href="https://github.com/nongbaoting/PISA" about="_blank">GitHub</a>.
              </p></div>
          </div>

      </el-col>
    </el-row>
    <!-- <router-link type="info" to="/sequence/blast/doc/psiblast"
      >PSI-BLAST
    </router-link>
    <router-link type="info" to="/sequence/blast/doc/jackhmmer"
      >jackhmmer
    </router-link> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePath: '',
    }
  },
  created() {
    this.getActivePath()
  },
  mounted(){

  },
  methods: {

    loadFigure(){},

    nvigate(){},
    getActivePath() {
      this.activePath = this.$route.path
    },
    handleOpen(key, keyPath10) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style lang="less"  scoped>
.el-menu-item {
  font-size: 18px;
}

/deep/ .el-menu-item-group {
  font-size: 18px;
}

.groupname {
  font-size: 16px;
}
</style>

<style lang="less" >
.subhead {
  padding: 10px;
  text-align: center;
  font-size: 20px;
}
.headtext {
  font-size: 20px;
}
.headtext-2 {
  font-size: 18px;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}
</style>