<template>
  <div>
<el-row :gutter="20">
    <el-col :offset="0.5" :span="3">
        <el-form >
            <el-form-item label="Upload Files" prop="upload_file">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="string"
            :on-change="handleChange"
              :file-list="fileList"
              :auto-upload="false"
              :multiple="false"
              :limit="limit"
              :accept="accept"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
               
                >Select File</el-button
              >

              <div slot="tip" class="el-upload__tip" style="line-height: 1.3">
                Protein structure files in
                <span class="p_em">.bcif, .pdb, .cif</span> format ( compression
                in <span class="p_em">.gz</span> is also supported ) <br />
                </span> file.
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm_domain_annotation')"
              >Summit</el-button
            >
            <el-button @click="resetForm('ruleForm_domain_annotation')">Reset</el-button>
          </el-form-item>
        </el-form>

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

    </el-col>
    <el-col :span="20">

      
            <el-row
              ><div id="molstar_large"></div> </el-row>
    </el-col>
</el-row>
  </div>
</template>

<script>
import 'molstar/build/viewer/molstar.css'
require('pdbe-molstar/build/pdbe-molstar-plugin-3.1.0')
var viewerInstance = new PDBeMolstarPlugin()

export default {
  data() {
    return {
      accept: '.pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,',
      limit: 5,
      multiple: false,
      fileList: [],
      created:false
    }
  },
    mounted() {
    window.viewerInstance = viewerInstance

  
   
  },
  methods: {
    pdbe(url,fileName) {
      //Set options (Checkout available options list in the documentation)
      var options = {
        // expanded: false,
        sequencePanel: true,
        // hideControls: true,
        customData: {
          url: url,
          format: 'cif',
        },
        moleculeId: fileName,
        alphafoldView: true,
        // bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [],
      }
      //Get element from HTML/Template to place the viewer
     
          
    var viewerContainer = document.getElementById('molstar_large')
    viewerInstance.render(viewerContainer, options)
          
    
      
    },
 handleChange(file, fileList) {
      this.fileList = fileList
    },
   submitForm(formName) {
     let file = this.fileList[0]
     let url = URL.createObjectURL(file.raw)
     let fileName = file.name
    this.pdbe(url,fileName)

    },
  resetForm(formName) {
     this.fileList = []
    },
  },
  
}
</script>

<style lang="less" scoped>

#molstar_large {
  float: left;
  width: 100%;
  height:80vh;
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
</style>