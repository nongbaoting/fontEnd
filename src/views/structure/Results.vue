<template>
  <div class="contianer">
    <el-row :gutter="20">
      <el-col>
        Job Name:
        {{
          this.$route.query.proj_name ? this.$route.query.proj_name : 'Example'
        }}
      </el-col>
    </el-row>

    <alphafold-view
      v-if="tools.indexOf('AlphaFold 2') !== -1 || tools.indexOf('AlphaFold multimer') !==-1"
      :proj_name="proj_name"
      title="AlphaFold 2"
      molstar_id="molstar_alphafold"
      :models="model_af"
      :tarFileName="proj_name + '_alphafold.tar.gz'"
      program="alphafold"
    ></alphafold-view>

    <rosettafold-view
      v-if="tools.indexOf('RoseTTAFold') !== -1"
      :proj_name="proj_name"
      title="RoseTTAFold"
      molstar_id="molstar_rosettafold"
      :models="model_rt"
      :tarFileName="proj_name + '_roseTTAFold.tar.gz'"
      program="roseTTAFold"
    ></rosettafold-view>
  </div>
</template>

<script>
import Tabs3d from './components/Tabs3d.vue'

export default {
  data() {
    var proj_name = this.$route.query.proj_name
      ? this.$route.query.proj_name
      : 'Example'
    return {
      proj_name: proj_name,
      tools: [],
      model_af: [
        'ranked_0.pdb',
        'ranked_1.pdb',
        'ranked_2.pdb',
        'ranked_3.pdb',
        'ranked_4.pdb',
      ],

      model_rt: [
        'model/model_1.pdb',
        'model/model_2.pdb',
        'model/model_3.pdb',
        'model/model_4.pdb',
        'model/model_5.pdb',
      ],
    }
  },

  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.proj_name = this.$route.query.proj_name
        ? this.$route.query.proj_name
        : 'Example'
    })
  },

  watch: {
    proj_name: function (newProjName, oldProjName) {
      this.getJob()
    },
  },

  mounted() {
    this.getJob()
  },
  methods: {
    getJob() {
      console.log(this.proj_name)
      this.$http
        .get('/protein/api/structure/search/', {
          params: {
            searchType: 'job_name_id',
            searchContent: this.proj_name,
          },
        })
        .then((res) => {
          let data = JSON.parse(res.data)
          this.tools = data[0].fields.tools.toString().split(',')

          // console.log(data)
          let params = JSON.parse(data[0].fields.params)
          // console.log(params.RoseTTAFold_mode)
          if (params.RoseTTAFold_mode === 'e2e') {
            this.model_rt = ['/t000_.e2e.pdb']
          }
        })
    },
  },
  components: {
    'alphafold-view': Tabs3d,
    'rosettafold-view': Tabs3d,
  },
}
</script>

<style lang="less" scoped>
.contianer {
  padding-top: 10px;
  padding-left: 10px;
}
.box {
  padding-top: 20px;
  font-size: calc(11px + 1vmin);
}
</style>