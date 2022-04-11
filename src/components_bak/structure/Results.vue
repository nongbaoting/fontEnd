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
      v-if="tools.indexOf('AlphaFold 2') !== -1"
      :proj_name="proj_name"
      title="AlphaFold 2"
      molstar_id="molstar_alphafold"
      :models="model_af"
      :linkObj="af_link"
    ></alphafold-view>
    <rosettafold-view
      v-if="tools.indexOf('RoseTTAFold') !== -1"
      :proj_name="proj_name"
      title="RoseTTAFold"
      molstar_id="molstar_rosettafold"
      :models="model_rt"
      :linkObj="rt_link"
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
        '/ranked_0.pdb',
        '/ranked_1.pdb',
        '/ranked_2.pdb',
        '/ranked_3.pdb',
        '/ranked_4.pdb',
      ],
      af_link: {
        baseURL:
          'http://222.200.186.47/outputs/results/alphafold/' +
          proj_name +
          '/' +
          proj_name,
        outBase: 'alphafold/',
        tar_suffix: '_alphafold.tar.gz',
      },
      model_rt: [
        '/model/model_1.pdb',
        '/model/model_2.pdb',
        '/model/model_3.pdb',
        '/model/model_4.pdb',
        '/model/model_5.pdb',
      ],
      rt_link: {
        baseURL:
          'http://222.200.186.47/outputs/results/roseTTAFold/' +
          proj_name +
          '/' +
          proj_name,
        outBase: 'roseTTAFold/',
        tar_suffix: '_roseTTAFold.tar.gz',
      },
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
    this.notice_tmp()
  },
  methods: {
    getJob() {
      console.log(this.proj_name)
      this.$http
        .get('api/structure/search/', {
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
    notice_tmp() {
      this.$notify({
        title: '注意',
        message:
          '目前此页面只显示Model 1, 其余model 可以通过ViewLarger链接过去',
        type: 'warning',
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
</style>