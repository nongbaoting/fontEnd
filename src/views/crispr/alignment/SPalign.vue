<template>
  <div class="container-flow" v-loading="loading" >
    <el-row :gutter="20">
      <el-col :span="10">
        <div>
          <el-descriptions
            class="margin-top box"
            title="SPalign Result"
            :column="3"
            border
          >
            <el-descriptions-item>
              <template slot="label"> AlphaFold </template>
              {{ input_pdb}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> PDB </template>
              {{ db_pdbid + ':' + db_pdbChain }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> Length 1 </template>
              
                {{ item.len_1 }}
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Length 2 </template>
                {{ item.len_2 }}
            </el-descriptions-item>

                 <el-descriptions-item>
              <template slot="label"> SPa  </template>
              {{ item.SPa }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> SPb </template>
              {{ item.SPb }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> SPe </template>
              {{ item.SPb }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> RMSD </template>
              {{ item.RMSD }}
            </el-descriptions-item>
            <!-- <el-descriptions-item>
              <template slot="label"> Coverage 1 </template>
              {{ item.cov_1 }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Coverage 2 </template>
              {{ item.cov_2 }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">Align Length</template>
              {{ item.align_len }}
            </el-descriptions-item> -->
            <el-descriptions-item>
              <template slot="label">Sequence Identity </template>
              {{ item.ali_ident }}
            </el-descriptions-item>
         
          </el-descriptions>
        </div>
        <div class="box">
          (':' denotes the residue pairs of distance <= 4A, and '.' denotes <=8A)

          <div v-html="html"></div>
        </div>
      </el-col>
      <el-col :span="14">
        <molstar-view-data
          v-if="item"
          :input_filename="input_pdb"
          :target_filename="db_pdbid"
          :input_name="input_name"
          :target_name="target_name"
          :align_url="align_url"
           tool="SPalign"
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
      loading: true,
      align_url: '/crispr/api/similarity/aligment/SPalign',
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
          input_pdb_id: this.$route.query.input_id,
          target_pdb_id: this.$route.query.target_id,
        },
      }).then((response) => {
        console.log(response)
        this.item = response.data
        this.loading = false
        this.format_algin_code(
          this.item.seq_1,
          this.item.pairwise,
          this.item.seq_2,
          this.item
        )
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