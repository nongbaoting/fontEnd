<template>
  <div class="container-flow">
    <el-row :gutter="20">
      <el-col :span="10">
        <div>
          <el-descriptions
            class="margin-top box"
            title="Target PDB Information"
            :column="3"
            :size="size"
            border
          >
            <el-descriptions-item>
              <template slot="label"> PDB </template>
              {{ item.chain_2_pdb + ':' + item.chain_2_chain }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">Uniprot </template>
              {{ item.chain_2_uniprot }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> Scope Family </template>
              <el-link
                target="_blank"
                type="success"
                :href="
                  'https://scop.mrc-lmb.cam.ac.uk/term/' +
                  item.chain_2_scopeDomain
                "
              >
                {{ item.family }}
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Scope SuperFamily </template>
              {{ item.superfamily }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> TMscore 1 </template>
              {{ item.tmscore_2 }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> TMscore 2 </template>
              {{ item.tmscore_2 }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> RMSD </template>
              {{ item.RMSD }}
            </el-descriptions-item>
            <el-descriptions-item>
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
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">Sequence Identity </template>
              {{ item.Seq_ID }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="box">
          (":" denotes residue pairs of d &lt 5.0 Angstrom, "." denotes other
          aligned residues)

          <div v-html="html"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <ngl-view-data
          v-if="item"
          :input_filename="input_pdb"
          :target_filename="db_pdb"
          :input_name="input_name"
          :target_name="target_name"
        ></ngl-view-data>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import nglView from '../components/ngl_superpose-data.vue'

export default {
  components: {
    'ngl-view-data': nglView,
  },
  data() {
    return {
      input_pdb: this.$route.query.input_pdb,
      db_pdb: this.$route.query.db_pdb,
      input_pdb_url: '',
      db_pdb_url: '',
      item: '',
      html: '',
      input_name: '',
      target_name: '',
    }
  },
  mounted() {
    this.getOneInfo()
  },
  methods: {
    getOneInfo() {
      this.$http({
        url: 'api/similarity/getOneItem/',
        params: {
          dataType: 'info',
          input_pdb: this.input_pdb,
          db_pdb: this.db_pdb,
          uuid: this.$route.query.uuid,
        },
      }).then((response) => {
        console.log(response)
        this.item = response.data
        this.format_algin_code(
          this.item.seq_1,
          this.item.pairwise,
          this.item.seq_2
        )
        this.input_name = this.item.chain_1.split('.pdb')[0]
        this.target_name = this.item.chain_2
      })
    },

    format_algin_code(seq_1, pairwise, seq_2) {
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