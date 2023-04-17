<template>
  <div class="container-flow">
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-descriptions class="margin-top box" :column="3" border>
           
          </el-descriptions>
        </div>
        <!-- <div class="box">
          (':' denotes the residue pairs of distance <= 4A, and '.' denotes
          <=8A)

          <div v-html="html"></div>
        </div> -->
        <pre class="code">
          {{ log }}
        </pre>
      </el-col>
      <el-col :span="11">
        <div></div>
        <molstar-view-data
          v-if="item"
          :input_filename="input_pdb"
          :target_filename="db_pdbid"
          :input_name="input_name"
          :target_name="target_name"
          :align_url="align_url"
          tool="FATCAT"
          style="margin-top: 150px"
        ></molstar-view-data>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import molstarlView from './molstar-data.vue'

export default {
  components: {
    'molstar-view-data': molstarlView,
  },
  data() {
    return {
      input_pdb: this.$route.query.proj_name,
      db_pdbid: this.$route.query.pdbid,
      db_pdbChain: this.$route.query.chain,
      view: false,
      item: '',
      html: '',
      input_name: '',
      target_name: '',
      align_url: '/protein/api/similarity/aligment/Fatcat',
      log: '',
    }
  },
  mounted() {
    this.getOneInfo()
  },
  methods: {
    getOneInfo() {
      this.$http({
        url: this.align_url,
        params: {
          dataType: 'info',
          input_pdb_proj: this.input_pdb_proj,
          db_pdbid: this.$route.query.pdbid,
          db_chain: this.$route.query.chain,
          uuid: this.$route.query.proj_name,
        },
      }).then((response) => {
        console.log(response)
        this.item = response.data
        this.log = response.data.log
        // this.format_algin_code(
        //   this.item.seq_1,
        //   this.item.pairwise,
        //   this.item.seq_2,
        //   this.item
        // )
        // this.input_name = this.item.chain_1.split('.pdb')[0]
        // this.target_name = this.item.chain_2
        this.input_name = this.$route.query.proj_name
        this.target_name = this.db_pdbid
      })
    },

    format_algin_code(seq_1, pairwise, seq_2, item) {
      console.log(seq_1)
      let arr_1 = seq_1.split('')
      let arr_2 = seq_2.split('')
      let arr_pw = pairwise.split('')
      let html = ''
      let span = 60
      let loops = Math.ceil(arr_1.length / span)
      for (let i = 0; i < loops; i++) {
        html +=
          '<pre class="code">' +
          arr_1.slice(i * span, (i + 1) * span).join('') +
          '</pre>'
        html +=
          '<pre class="code">' +
          arr_pw.slice(i * span, (i + 1) * span).join('') +
          '</pre>'
        html +=
          '<pre class="code">' +
          arr_2.slice(i * span, (i + 1) * span).join('') +
          '\n\n</pre>'
        html += '<p>\n</p>'
      }
      this.html = html
    },
  },
}
</script>

<style>
.code {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  border: 1px;
}
.box {
  padding: 0px 10px;
  padding-top: 20px;
}
</style>