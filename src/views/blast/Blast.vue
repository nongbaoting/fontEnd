<template>
  <div style="padding-top: 40px" class="container">
    <el-row id="app_form_predict">
      <el-col :span="18" :offset="3">
        <h2 class="title">Iteration BLAST</h2>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="180px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item prop="sequence">
            <span slot="label">
              <span class="span-box">
                <span>Input Sequence</span>
              </span>
            </span>
            <el-input
              type="textarea"
              v-model="ruleForm.sequence"
              :autosize="{ minRows: 8, maxRows: 80 }"
              clearable
            ></el-input>
          </el-form-item>
          <!-- database -->
          <el-form-item label="Database">
            <el-select
              v-model="ruleForm.db"
              placeholder="select database"
              style="width: 50%"
            >
              <el-option label="nr" value="nr"></el-option>
              <el-option
                label="nr (Bacteria, Archaea, Viruses)"
                value="meta"
              ></el-option>
              <el-option
                label="nr_gt400 (Length large than 400 AA) "
                value="nr_gt400"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Program" prop="program">
            <el-checkbox-group v-model="ruleForm.program">
              <el-checkbox label="BLASTP" border></el-checkbox>
              <el-checkbox label="jackhmmer" border></el-checkbox>
              <el-checkbox label="PSI-BLAST" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- email -->
          <el-form
            :model="ruleForm"
            :inline="true"
            :rules="rules"
            class="demo-ruleForm"
            label-position="right"
          >
            <el-form-item
              label-width="180px"
              width="200px"
              label="Project"
              prop="job_name"
            >
              <el-input
                v-model="ruleForm.job_name"
                type="text"
                auto-complete="on"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="120px" label="Email" prop="email">
              <el-input
                v-model="ruleForm.email"
                type="email"
                auto-complete="on"
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- 参数 -->
          <div class="params">
            <el-button
              type="success"
              :icon="icon_param"
              plain
              @click="openParam"
              style="width: 100%; text-align: left"
            >
              Algorithm Parameters</el-button
            >
            <div v-show="icon_param_toggle">
              <!-- Commone -->
              <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>Common</span>
                </div>

                <el-form-item
                  label="Target Protein Length:"
                  prop="jackhmmer_iter"
                >
                  <el-input
                    style="width: 40%"
                    v-model="ruleForm.jackhmmer_iter"
                    type="number"
                    auto-complete="on"
                  ></el-input>
                  <span style="width: 20%"> to </span>
                  <el-input
                    style="width: 40%"
                    :min="400"
                    :max="10000"
                    v-model="ruleForm.jackhmmer_iter"
                    type="number"
                    auto-complete="on"
                  ></el-input>
                </el-form-item>
              </el-card> -->

              <!-- jackhmmer -->
              <el-card
                class="box-card"
                v-show="ruleForm.program.indexOf('jackhmmer') !== -1"
              >
                <div slot="header" class="clearfix">
                  <span>jackhmmer</span>
                </div>

                <el-form-item label="Iteration Times" prop="jackhmmer_iter">
                  <el-input-number
                    :min="3"
                    :max="10"
                    v-model="ruleForm.jackhmmer_iter"
                    type="number"
                    auto-complete="on"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  label="Advanced parameters"
                  prop="jackhmmer_advance"
                >
                  <el-input
                    v-model="ruleForm.jackhmmer_advance"
                    type="text"
                    placeholder="-E 1E-3"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-question"
                      @click="showJackhmmer_param"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-card>
              <!-- psi-blast -->
              <el-card
                class="box-card"
                v-show="ruleForm.program.indexOf('PSI-BLAST') !== -1"
              >
                <div slot="header" class="clearfix">
                  <span>PSI-BLAST</span>
                </div>

                <el-form-item label="Iteration Times" prop="psiblast_iter">
                  <el-input-number
                    :min="3"
                    :max="10"
                    v-model="ruleForm.psiblast_iter"
                    type="number"
                    auto-complete="on"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  label="Advanced parameters"
                  prop="psiblast_advance"
                >
                  <el-input
                    v-model="ruleForm.psiblast_advance"
                    type="text"
                    placeholder="-evalue 1E-3 -word_size 3"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-question"
                      @click="showPSIBLAST_param"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-card>
            </div>
          </div>

          <!-- 提交表单 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >Run BLAST</el-button
            >
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
            <el-button @click="ExampleFrom()">Example</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <view-psiblast-params
        :drawer="drawer"
        @funcInSon="showPSIBLAST_param"
      ></view-psiblast-params> -->
      <!-- <view-jackhmmer-params></view-jackhmmer-params> -->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Structure_prediction',

  data() {
    var checkStar = function (rule, value, callback) {
      const starMatch = /\*/
      const spMatch = /;/
      const mychar = /[^\w -\s]/
      if (starMatch.test(value)) {
        return callback(
          new Error("' * ' is not allowed in the  advanced parameters!")
        )
      } else if (spMatch.test(value)) {
        return callback(
          new Error("' ; ' is not allowed in the advanced parameters!")
        )
      } else if (mychar.test(value.substr(-1, 1))) {
        return callback(
          new Error(
            "'" +
              value.substr(-1, 1) +
              "' is not allowed in the advanced parameters!"
          )
        )
      } else {
        return callback()
      }
    }

    return {
      icon_param: 'el-icon-plus',
      icon_param_toggle: false,
      ruleForm: {
        job_name: '',
        email: '',
        program: ['BLASTP'],
        sequence: '',
        db: 'nr_gt400',
        psiblast_iter: 5,
        psiblast_advance: '-evalue 1E-3 -word_size 3',
        jackhmmer_iter: 5,
        jackhmmer_advance: '-E 1E-3',
      },
      rules: {
        jackhmmer_advance: [{ validator: checkStar, trigger: 'change' }],
        psiblast_advance: [{ validator: checkStar, trigger: 'change' }],
        sequence: [
          {
            required: true,
            message: 'Please input protein sequence!',
            trigger: 'blur',
          },
          { validator: checkStar, trigger: 'blur' },
        ],

        email: [
          {
            type: 'email',

            message: 'please input valid email address!',
            trigger: 'change',
          },
        ],
        program: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one program',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  created() {
    // this.get_token()
  },
  methods: {
    openParam() {
      this.icon_param_toggle = !this.icon_param_toggle
      if (this.icon_param_toggle) {
      }
      this.icon_param = this.icon_param_toggle
        ? 'el-icon-minus'
        : 'el-icon-plus'
    },

    showPSIBLAST_param() {
      let routeData = this.$router.resolve({
        path: '/sequence/blast/doc/psiblast',
      })
      window.open(routeData.href, '_blank')
    },
    showJackhmmer_param() {
      let routeData = this.$router.resolve({
        path: '/sequence/blast/doc/jackhmmer',
      })
      window.open(routeData.href, '_blank')
    },

    submitForm(formName) {
      console.log(this.ruleForm)
      this.ruleForm.sequence = this.ruleForm.sequence.toString().trim()

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getFormResponse()
        } else {
          this.$message.error('error input!')
          return false
        }
      })
    },

    getFormResponse() {
      this.$http
        .post(
          'api/blast/psijackhmmer/',
          //headers: { 'X-CSRFToken': window.sessionStorage.getItem('X-CSRFToken') },
          this.ruleForm
        )
        .then((res) => {
          console.log('return')
          console.log(res)
          if (res.data.status == 200) {
            this.$router.push('/sequence/blast/queue')
          } else {
            this.$message.error(
              'Your input Sequence may be wrong, please try check and try again!'
            )
          }
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    ExampleFrom() {
      this.ruleForm.job_name = 'blast_job_1'
      this.ruleForm.email = 'HelloWorld@gmail.com'
      this.ruleForm.program = ['BLASTP']
      this.ruleForm.sequence =
        '>I-Fv Cas5fv\nMKIIIEYDSCWRNAFLGGSNNEPVPKKGREFLGSMTSLKKEGNFKVCENTLDTVMGVLNRLIGDQRKLYQARSKMYESAYYFEALEDKVSFIDKPQLTNEISFIRNMNGSTDQNAFTGMIKVSDPVFTSEYSQQFWGVLALDFTQLCDFIIKQSQVVGSIELNPLSIINRLESLNQEKALENSDDLAQVLKVLNEYFPDIEYLNNKGLITPISIYCSALYLQLARLETSFNMTTAKTKAGGISGISKRGFTKKDFMDRYTTGPKKTIWGNPFIKKEKIKGQGEVTSMMTKASGQLEISIDVDRDKAQEIKILIENAGVSSFYLGKKGLAYVSNIKL'
    },
  },
}
</script>

<style lang="less" scoped>
.toggle_box {
  border: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}
.on_bottom {
  display: flex;
  align-items: flex-end;
}

.text {
  font-size: calc(11px + 1vmin);
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-top: 10px;
}

/deep/ .el-card__header {
  padding: 10px 10px;
}

/deep/ .el-card__body {
  padding: 0px;
  padding-right: 10px;
}
.params {
  margin-bottom: 20px;
}
</style>