<template>
  <div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="12" :offset="6">
        <h2 class="title">Structure Prediction</h2>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item prop="protein_seq">
            <span slot="label">
              <span class="span-box">
                <!-- <el-popover placement="left" :width="300" trigger="click">
                  <template #reference>
                    <i class="el-icon-question ico-pre"></i>
                  </template>
                  <div>
                    <span>
                      Fasta Format:<br />
                      >id<br />MAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCT
                    </span>
                    <el-divider></el-divider>
                    <span>
                      Plain Sequence:<br />
                      MAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCT
                    </span>
                    <el-divider></el-divider>

                    <span
                      >GeneBank Format:<br /><code
                        >1 MAWTKYQLFL AGLMLVTGSI <br />21 CLAAFYLLRC
                        RAAGQSDSSV</code
                      >
                    </span>
                  </div>
                </el-popover> -->
                <span>Input Sequence</span>
              </span>
            </span>

            <el-input
              type="textarea"
              v-model="ruleForm.protein_seq"
              :autosize="{ minRows: 4, maxRows: 20 }"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Platform" prop="platform">
            <el-checkbox-group v-model="ruleForm.platform">
              <el-checkbox label="AlphaFold 2" checked></el-checkbox>
              <el-checkbox label="RoseTTAFold"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            class="toggle_box"
            label-width="180px"
            label="RoseTTAFold Mode:"
            prop="RoseTTAFold_mode"
            v-show="ruleForm.platform.indexOf('RoseTTAFold') !== -1"
          >
            <el-radio v-model="ruleForm.RoseTTAFold_mode" label="pyrosetta"
              >pyrosetta</el-radio
            >
            <el-radio v-model="ruleForm.RoseTTAFold_mode" label="e2e"
              >End-to-End</el-radio
            >
          </el-form-item>

          <el-form-item label="Job Name" prop="proj_name">
            <el-input v-model="ruleForm.proj_name"></el-input>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input
              v-model="ruleForm.email"
              type="email"
              auto-complete="on"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >Summit</el-button
            >
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
            <el-button @click="ExampleFrom()">Example</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BugReport from './components/bugReport.vue'

export default {
  name: 'Structure_prediction',
  components: {
    'bugReport-view': BugReport,
  },

  data() {
    var checkStar = function (rule, value, callback) {
      const starMatch = /\*/
      if (starMatch.test(value)) {
        return callback(
          new Error("' * ' is not allowed in the input sequence!")
        )
      } else {
        return callback()
      }
    }

    return {
      ruleForm: {
        proj_name: '',
        email: '',
        platform: [],
        protein_seq: '',
        RoseTTAFold_mode: 'pyrosetta',
      },
      rules: {
        proj_name: [
          {
            required: true,
            message: 'Please input a job name!',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 20,
            message: 'length 3 to 20 characters',
            trigger: 'blur',
          },
          { validator: this.checkProName, trigger: 'blur' },
        ],

        protein_seq: [
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
        platform: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one platform',
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
    submitForm(formName) {
      this.ruleForm.protein_seq = this.ruleForm.protein_seq.toString().trim()
      this.ruleForm.proj_name = this.ruleForm.proj_name.toString().trim()

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getFormResponse()
        } else {
          // this.$message.error('error input!')
          return false
        }
      })
    },

    getFormResponse() {
      this.$http
        .post(
          '/predict/structure_submit/',
          //headers: { 'X-CSRFToken': window.sessionStorage.getItem('X-CSRFToken') },
          this.ruleForm
        )
        .then((res) => {
          console.log(res)
          if (res.data.uploadOk) {
            this.$router.push('/predict/structure/queue/')
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
      this.ruleForm.proj_name = 'Job_1'
      this.ruleForm.email = 'HelloWorld@gmail.com'
      this.ruleForm.platform = ['AlphaFold 2']
      this.ruleForm.protein_seq =
        'MAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCTWTFGVDTHLATATSCTYVVKANANASQASGGPVTCGPYTITSSWSGQFGPNNGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH'
    },

    async checkProName(rule, value, callback) {
      const { data: res } = await this.$http.get('/predict/structure/check/', {
        params: { proj_name: value },
      })

      if (res.isExist == 1) {
        return callback(new Error('Job name exists !'))
      } else {
        return callback()
      }
    },

    async get_token() {
      const { data: res } = await this.$http.get('get_token')

      window.sessionStorage.setItem('X-CSRFToken', res.token)
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
</style>