<template>
  <div class="container">
    <el-row
      ><el-col :span="12" :offset="3">
        <div>
          <h2 style="padding: 20px 0px">Job: {{ job_name }}</h2>
          <p>using CDD All curated 58235 pssm</p>
        </div>
        <div>
          <h2>BLASTP</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail('BLASTP', '/sequence/blast/res/psiblast/', 'new')
            "
            :disabled="BLASTP_status != 0"
            >BLASTP</el-link
          >
          <el-link
            style="padding-left: 20px"
            type="primary"
            @click="to_architechures('BLASTP')"
            :disabled="BLASTP_status != 0"
            >Architechures</el-link
          >
        </div>
        <div>
          <h2>PSI-BLAST</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail(
                'psiblast',
                '/sequence/blast/res/psiblast/',
                'new'
              )
            "
            :disabled="psiblast_status != 0"
            >PSI-BLAST</el-link
          >
          <el-link
            style="padding-left: 20px"
            type="primary"
            @click="to_architechures('psiblast')"
            :disabled="psiblast_status != 0"
            >Architechures</el-link
          >
        </div>
        <div>
          <h2>jackhmmer</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail(
                'jackhmmer',
                '/sequence/blast/res/psiblast/',
                'new'
              )
            "
            :disabled="jackhmmer_status != 0"
            >jackhmmer</el-link
          >
          <el-link
            style="padding-left: 20px"
            type="primary"
            @click="to_architechures('jackhmmer')"
            :disabled="jackhmmer_status != 0"
            >Architechures</el-link
          >
        </div>
      </el-col></el-row
    >

    <el-row v-if="isOld"
      ><el-col :span="12" :offset="3">
        <div>
          <p style="padding: 20px 0px">
            -----------------------------------------------------
          </p>
          <h2>Old annotations</h2>
          <p>using GeneBank region</p>
        </div>
        <div>
          <h2>BLASTP</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail('BLASTP', '/sequence/blast/res/psiblast/', 'old')
            "
            :disabled="BLASTP_status != 0"
            >BLASTP</el-link
          >
        </div>
        <div>
          <h2>PSI-BLAST</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail(
                'psiblast',
                '/sequence/blast/res/psiblast/',
                'old'
              )
            "
            :disabled="psiblast_status != 0"
            >PSI-BLAST</el-link
          >
        </div>
        <div>
          <h2>jackhmmer</h2>
          <el-link
            type="primary"
            @click="
              to_result_detail(
                'jackhmmer',
                '/sequence/blast/res/psiblast/',
                'old'
              )
            "
            :disabled="jackhmmer_status != 0"
            >jackhmmer</el-link
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uuid: this.$route.query.uuid,
      job_name: this.$route.query.job_name,
      BLASTP_status: -1,
      psiblast_status: -1,
      jackhmmer_status: -1,
      isOld: false,
    }
  },
  mounted() {
    this.check_status()
    this.check_date()
  },
  methods: {
    to_result_detail(program, path, dataset) {
      console.log(this.uuid)
      let that = this
      this.$router.push({
        path: path,
        query: {
          uuid: that.uuid,
          program: program,
          job_name: that.job_name,
          dataset: dataset,
        },
      })

      // window.open(routeData.href, '_blank')
    },
    to_architechures(program) {
      let routeData = this.$router.resolve({
        path: '/sequence/blast/res/architectures/',
        query: {
          uuid: this.uuid,
          program: program,
          job_name: this.job_name,
        },
      })
      window.open(routeData.href, '_blank')
    },

    check_date() {
      let timeline = new Date('2022-04-04T20:40:22.550')
      let datetime = new Date(this.$route.query.datetime)

      if (datetime <= timeline) {
        this.isOld = true
      }
    },

    check_status() {
      let status_arr = this.$route.query.run_status.split(',')
      console.log(status_arr)
      this.psiblast_status = status_arr[0]
      this.jackhmmer_status = status_arr[1]
      this.BLASTP_status = status_arr[2]
      console.log(this.psiblast_status)
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  font-size: calc(11px + 1vmin);
  font-family: sans-serif;
}

/deep/ .el-link {
  font-size: calc(11px + 1vmin);
  font-family: sans-serif;
}
</style>