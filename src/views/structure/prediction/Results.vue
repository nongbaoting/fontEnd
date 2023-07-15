<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Result</h5>
        <el-menu :default-active="activeItem" @select="handleSelect">
          <el-menu-item :index="item" v-for="(item, index) in platforms">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title" align="center">{{ item }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="16">
        <tab3DViewer
          v-if="program"
          :uuid="uuid"
          molstar_id="molstar_alphafold"
          :models="models"
          :program="program"
          :job_name="job_name"
        ></tab3DViewer>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tab3DViewer from './tab3D-viewer.vue'
const NotPrograms = ['Monomer']
export default {
  data() {
    return {
      activeItem: '',
models: [
        'ranked_0.cif',
        // 'ranked_1.cif',
        // 'ranked_2.cif',
        // 'ranked_3.cif',
        // 'ranked_4.cif',
      ],
      uuid: this.$route.query.uuid,
      job_name: this.$route.query.job_name,
      program: this.activePath,

      params: {},
      platforms:[]
    }
  },
  mounted() {
    this.getInfo()
  },

  methods: {
    getInfo() {
      this.$http
        .get('/protein/api/structure/result_new/', {
          params: {
            uuid: this.$route.query.uuid,
          },
        })
        .then((res) => {
          console.log(res.data)
          this.params = res.data
          res.data.platform.forEach(element => {
              if(! NotPrograms.includes(element)){
                  this.platforms.push(element)
              }
          });
          this.program = this.platforms[0]
        
        })
    },

    handleSelect() {
      this.program = this.activeItem
    },
  },
  components: {
    tab3DViewer,
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