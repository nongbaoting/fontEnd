<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Result</h5>
        <el-menu :default-active="activePath">
            <el-menu-item :index="item" v-for="(item,idex) in params.platform">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title" align="center">{{item}}</span>
          </el-menu-item>

        </el-menu>
      </el-col>

      <el-col :span="16">

        <tab3DViewer
            v-if="program"
            :uuid = "uuid"    
            
             molstar_id="molstar_alphafold"          
            :program="program"
            :job_name="job_name"
        ></tab3DViewer>
    
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tab3DViewer from './tab3D-viewer.vue'

export default {
  data() {
    return {
      activePath: '',
      uuid: this.$route.query.uuid,
      job_name: this.$route.query.job_name,
      program:this.activePath,
      isfilter: false,
     params:{}
    }
  },
  mounted() {
      this.getInfo()
  },

  methods: {
      
      getInfo(){
          this.$http.get('/protein/api/structure/result_new/',
              {params:{
                  uuid: this.$route.query.uuid
              }}
          ).then((res)=>{
              console.log(res.data)
              this.params =res.data
              this.program = res.data.platform[0]
          })
      }
    
  },
  components: {
   tab3DViewer
  },
}
</script>

<style>
.block {
}

.min_input {
  width: 160px;
}
</style>