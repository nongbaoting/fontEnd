<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Alignment Score</h5>
        <el-menu :default-active="activePath" @select="chooseScore">
          <el-menu-item index="SPalign">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalign</span>
          </el-menu-item>
          <el-menu-item index="SPalignNS">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalignNS</span>
          </el-menu-item>
          <el-menu-item index="TMalign">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">TMalgin</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18"
        ><SPScore v-if="activePath === 'SPalign'" :tool="activePath"></SPScore>
        <SPScoreNS
          v-if="activePath === 'SPalignNS'"
          :tool="activePath"
        ></SPScoreNS>
        <TMScore v-if="activePath === 'TMalign'"></TMScore>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SPScore from './AlignScore/SPScore.vue'
import TMScore from './AlignScore/TMscore.vue'
export default {
  data() {
    return {
      activePath: 'SPalign',
      showTools: 'SPalign',
    }
  },

  methods: {
    chooseScore(index) {
      this.activePath = index
    },
  },
  components: {
    SPScore,
    TMScore,
    SPScoreNS: SPScore,
  },
}
</script>

<style>
</style>