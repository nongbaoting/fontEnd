<template>
  <div>
    <div class="center" style="height: 200px">
      <h1>Phylogenetic Tree</h1>
      <h1 class="main-text">Job Name:{{ job_name }}</h1>
      <div class="msa" id="msa"></div>
      <div class="main-text">
        <p>Download</p>
        <li>
          <el-link
            type="primary"
            @click="downTextFile('tree_file', 'msa.treefile')"
            >Tree file</el-link
          >
        </li>
        <li>
          <el-link type="primary" @click="downTextFile('msa', 'msa.fasta')">
            Multi-aligment sequence (MSA)</el-link
          >
        </li>
      </div>
    </div>

    <!-- <pdf :src="pdfUrl"></pdf>
    <iframe :src="pdfUrl" style="width: 100%; height: 90vh"></iframe> -->
    <iframe
      :src="pdfUrl"
      frameborder="0"
      style="width: 100%; height: 90vh"
    ></iframe>
  </div>
</template>

<script>
// import pdf from 'vue-pdf'
import msa from 'msa'
export default {
  components: {},
  data() {
    return {
      pdfUrl: '',
      job_name: this.$route.query.job_name,
      msa_data: '',
    }
  },
  mounted() {
    // this.getPdfCode()
    this.pdfPreview()
    // this.mymsa()
  },
  methods: {
    // 将返回的流数据转换为url
    pdfPreview() {
      this.previewDownFile('tree_pdf').then((v) => {
        if (v.status == 200) {
          const binaryData = []
          binaryData.push(v.data)
          let url = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'application/pdf' })
          )
          this.pdfUrl = url
        } else {
          this.$message.error('请求错误！')
        }
      })
    },

    downTextFile(wantedType, outFiName) {
      this.previewDownFile(wantedType).then((v) => {
        if (v.status == 200) {
          let binaryData = []
          binaryData.push(v.data)
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'application/txt' })
          )
          link.download = outFiName
          link.click()
          link.remove()
        } else {
          this.$message.error('error !')
        }
      })
    },
    previewDownFile(wantedType) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: `/protein/api/phylo/tree_files/`,
          params: {
            wantedType: wantedType,
            uuid: this.$route.query.uuid,
          },
          timeout: 0,
          method: 'get',
          responseType: 'blob',
          header: { 'Content-Type': 'multipart/form-data' },
        })
          .then((res) => {
            resolve(res)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
  },
}
</script>

<style scoped>
.center {
  margin: auto;
  width: 90%;
  padding: 10px 20px;
  text-align: left;
}
.main-text {
  padding: 10px 0px;
  text-align: left;
  margin: auto;
}
</style>