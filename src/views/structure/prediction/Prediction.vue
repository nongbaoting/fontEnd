<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Algorithms</h5>
        <el-menu :default-active="activePath" @select="chooseScore">
          <el-menu-item index="AlphaFold2">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title" align="center">AlphaFold2</span>
          </el-menu-item>

          <el-menu-item index="AlphaFold2_multimer">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">AlphaFold2-multimer</span>
          </el-menu-item>

          <!-- <el-menu-item index="FATCAT">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">FATCAT</span>
          </el-menu-item> -->
        </el-menu>
      </el-col>

      <el-col :span="16">
        <AlphaFold2
          v-if="activePath === 'AlphaFold2'"
          :filters="formInline"
          :isfilter="isfilter"
        ></AlphaFold2>

        <AlphaFold2-multimer
          v-if="activePath === 'AlphaFold2_multimer'"
          :tool="activePath"
          :filters="formInline"
          :isfilter="isfilter"
        ></AlphaFold2-multimer>
        <SPScoreNS
          v-if="activePath === 'SPalignNS'"
          :tool="activePath"
          :filters="formInline"
          :isfilter="isfilter"
        ></SPScoreNS>

        <Fatcat-score-view
          v-if="activePath === 'FATCAT'"
          :filters="formInline"
          :isfilter="isfilter"
        ></Fatcat-score-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AlphaFold2 from './alphafold2.vue'
import AlphaFold2_multimer from './alphafold2-multimer.vue'
export default {
  data() {
    return {
      activePath: 'AlphaFold2',
      showTools: 'AlphaFold2',

      isfilter: false,
      formInline: {
        min_len: 1250,
        max_len: 1450,
        min_SI: 0,
        max_SI: 1,
        protein: 'spCas9-3',
        exclude_knownCas: true,
        candidates: false,
      },
    }
  },

  methods: {
    chooseProtein() {
      console.log(this.formInline.protein)
      switch (this.formInline.protein) {
        case 'spCas9-3':
          this.formInline.min_len = 1250
          this.formInline.max_len = 1450
          break
        case 'cjCas9-3':
          this.formInline.min_len = 900
          this.formInline.max_len = 1100
          break
        case 'Nme1Cas9-3':
          this.formInline.min_len = 950
          this.formInline.max_len = 1200
          break

        default:
          this.formInline.min_len = 0
          this.formInline.max_len = 10000
      }
    },
    chooseScore(index) {
      this.activePath = index
    },
    onFilter() {
      this.isfilter = !this.isfilter
    },
  },
  components: {
    AlphaFold2,
    'AlphaFold2-multimer': AlphaFold2_multimer,
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