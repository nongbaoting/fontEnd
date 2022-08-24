<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="2">
        <h5 class="subhead">Alignment Score</h5>
        <el-menu :default-active="activePath" @select="chooseScore">
          <el-menu-item index="TMalign">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">TMalgin</span>
          </el-menu-item>

          <el-menu-item index="SPalign">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalign</span>
          </el-menu-item>
          <!-- <el-menu-item index="SPalignNS">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalignNS</span>
          </el-menu-item> -->

          <el-menu-item index="FATCAT">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">FATCAT</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20">
        <el-row style="padding-top: 20px">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 蛋白 -->
            <el-form-item label="Choose Cas9">
              <el-select v-model="formInline.protein" @change="chooseProtein()">
                <el-option label="spCas9" value="spCas9-3"></el-option>
                <el-option label="cjCas9" value="cjCas9-3"></el-option>
                <el-option label="Nme1Cas9" value="Nme1Cas9-3"></el-option>
              </el-select>
            </el-form-item>
            <!-- 长度 -->
            <el-form-item label="Length 2 Range">
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
            <el-form-item label="Identity Range">
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
              <el-checkbox v-model="formInline.exclude_knownCas"
                >Exclude Known Cas9</el-checkbox
              >
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onFilter">Search</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <TMScore
          v-if="activePath === 'TMalign'"
          :filters="formInline"
          :isfilter="isfilter"
        ></TMScore>

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
import SPScore from './AlignScore/SPScore.vue'
import TMScore from './AlignScore/TMscore.vue'
import FatcatScore from './AlignScore/FatcatScore.vue'

export default {
  data() {
    return {
      activePath: 'FATCAT',
      showTools: 'SPalign',

      isfilter: false,
      formInline: {
        min_len: 1250,
        max_len: 1450,
        min_SI: 0,
        max_SI: 1,
        protein: 'spCas9-3',
        exclude_knownCas: true,
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
    SPScore,
    TMScore,
    SPScoreNS: SPScore,
    'Fatcat-score-view': FatcatScore,
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