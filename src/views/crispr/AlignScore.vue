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

      <el-col :span="18">
        <el-row style="padding-top: 20px">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 蛋白 -->
            <el-form-item label="Choose Cas9">
              <el-select v-model="formInline.protein" @change="chooseProtein()">
                <el-option label="spCas9" value="spCas9"></el-option>
                <el-option label="cjCas9" value="cjCas9"></el-option>
              </el-select>
            </el-form-item>
            <!-- 长度 -->
            <el-form-item label="Length Range">
              <div class="block">
                <el-row :gutter="0">
                  <!-- Target Length  -->
                  <!-- TODO  traget lenth-->

                  <el-col :span="10"
                    ><el-input
                      class="min_input"
                      v-model="formInline.min_len"
                      type="number"
                    >
                      <el-button slot="prepend">Min:</el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="1" class="inline" style="padding-left: 10px"
                    ><span>-</span></el-col
                  >
                  <el-col :span="10"
                    ><el-input
                      class="min_input"
                      type="number"
                      v-model="formInline.max_len"
                    >
                      <el-button slot="prepend">Max:</el-button>
                    </el-input></el-col
                  >
                </el-row>
              </div>
            </el-form-item>

            <!-- idnetity -->
            <el-form-item label="SI Range">
              <div class="block">
                <el-row :gutter="0">
                  <!-- Target Length  -->
                  <!-- TODO  traget lenth-->

                  <el-col :span="10"
                    ><el-input
                      class="min_input"
                      v-model="formInline.min_SI"
                      type="number"
                    >
                      <el-button slot="prepend">Min:</el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="1" class="inline" style="padding-left: 10px"
                    ><span>-</span></el-col
                  >
                  <el-col :span="10"
                    ><el-input
                      class="min_input"
                      type="number"
                      v-model="formInline.max_SI"
                    >
                      <el-button slot="prepend">Max:</el-button>
                    </el-input></el-col
                  >
                </el-row>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onFilter">Search</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <SPScore
          v-if="activePath === 'SPalign'"
          :tool="activePath"
          :filters="formInline"
          :isfilter="isfilter"
        ></SPScore>
        <SPScoreNS
          v-if="activePath === 'SPalignNS'"
          :tool="activePath"
          :filters="formInline"
          :isfilter="isfilter"
        ></SPScoreNS>
        <TMScore
          v-if="activePath === 'TMalign'"
          :filters="formInline"
          :isfilter="isfilter"
        ></TMScore>
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

      isfilter: false,
      formInline: {
        min_len: 1200,
        max_len: 1400,
        min_SI: 0,
        max_SI: 1,
        protein: 'spCas9',
      },
    }
  },

  methods: {
    chooseProtein() {
      console.log(this.formInline.protein)
      switch (this.formInline.protein) {
        case 'spCas9':
          this.formInline.min_len = 1200
          this.formInline.max_len = 1400
          break
        case 'cjCas9':
          this.formInline.min_len = 900
          this.formInline.max_len = 1100
          break
        default:
          this.formInline.min_len = 0
          this.formInline.max_len = 2000
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
    SPScore,
    TMScore,
    SPScoreNS: SPScore,
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