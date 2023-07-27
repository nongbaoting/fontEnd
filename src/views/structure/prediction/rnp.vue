<template>
  <div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="18" :offset="3">
        <h2 class="title">Structure Prediction</h2>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="200px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item prop="protein_seq">
            <span slot="label">
              <span class="span-box">
                <span>Protein Sequence</span>
              </span>
            </span>

            <el-input
              type="textarea"
              v-model="ruleForm.protein_seq"
              :autosize="{ minRows: 4, maxRows: 40 }"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="nucleic_seq">
            <span slot="label">
              <span class="span-box">
                <span>Nucleic acid Sequence</span>
              </span>
            </span>

            <el-input
              type="textarea"
              v-model="ruleForm.nucleic_seq"
              :autosize="{ minRows: 4, maxRows: 40 }"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Nucleic Acid Type" prop="nucleic_type">
            
            <el-radio v-model="ruleForm.nucleic_type" label="R">RNA</el-radio>
          <el-radio v-model="ruleForm.nucleic_type" label="D">Double Strand DNA</el-radio>
          <el-radio v-model="ruleForm.nucleic_type" label="S">Single Strand DNA</el-radio>
          </el-form-item>


          <el-form-item label="Platform" prop="platform">
            <div class="block">
              <el-cascader
                :options="options"
                :props="props"
                v-model="ruleForm.platform"
                collapse-tags
                size="median"
                clearable
              ></el-cascader>
            </div>
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
            <el-button @click="ExampleFrom_mono()">Example</el-button>
            <!-- <el-button @click="ExampleFrom_multi()">Example(multi)</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="Warning: input sequence contain non-standard residues! Predition process may failed!"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <span v-html="newseq"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
const restypes = [
  'A',
  'R',
  'N',
  'D',
  'C',
  'Q',
  'E',
  'G',
  'H',
  'I',
  'L',
  'K',
  'M',
  'F',
  'P',
  'S',
  'T',
  'W',
  'Y',
  'V',
]
function colorSeq(seq) {
  const fastaMatch = /\>/
  let seq_arr = seq.split('\n')
  if (fastaMatch.test(seq)) {
    seq_arr = seq_arr.slice(1)
    console.log('> slice' + seq_arr)
  }
  let newseq = '<div class="sequence">'
  let count = 0
  seq_arr.forEach((m, i) => {
    newseq += '<p>'

    let residues = m.split('')
    residues.forEach((v, i) => {
      if (restypes.indexOf(v.toUpperCase()) === -1) {
        console.log(v + ' ' + i)
        newseq += '<span style="color:red">' + v + '</span>'
        count += 1
      } else {
        newseq += v
      }
    })
    newseq += '</p>'
  })
  newseq += '</div>'
  let res = {
    newseq: newseq,
    count: count,
  }
  return res
}

export default {
  name: 'Structure_prediction',
  components: {},

  data() {
    return {
      dialogVisible: false,
      newseq: '',
      type: 'Monomer',
      props: { multiple: false },
      options: [
        {
          value: 'RF2NA',
          label: 'RoseTTAFold2NA',
         
        },
       
      ],
      ruleForm: {
        proj_name: '',
        email: '',
        platform: ['RF2NA'],
        nucleic_type:'R',
        protein_seq: '',
        nucleic_seq: '',
        project_type: 'RNP',
        proj_type:'Structure Prediction',
       
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
            max: 100,
            message: 'length 3 to 100 characters',
            trigger: 'blur',
          },
          // { validator: this.checkProName, trigger: 'blur' },
        ],

        protein_seq: [
          {
            required: true,
            message: 'Please input protein sequence!',
            trigger: 'blur',
            // type:'text',
          },
          // { validator: this.checkStar, trigger: 'blur' },
        ],
nucleic_seq:[ {
            required: true,
            message: 'Please input Nucleic acid sequence!',
            trigger: 'blur',
            // type:'text',
          },],
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
    checkStar(rule, value, callback) {
      const starMatch = /\*/

      if (starMatch.test(value)) {
        return callback(
          new Error("' * ' is not allowed in the input sequence!")
        )
      } else {
        let residues = value.split('')
        let res = colorSeq(value)
        if (res.count > 0) {
          console.log('odd residues:' + res.count)
          console.log(res.newseq)
          this.dialogVisible = true
          this.newseq = res.newseq
        }

        return callback()
      }
    },
    openSeq() {},

    submitForm(formName) {
      console.log(this.ruleForm.protein_seq)
      this.ruleForm.protein_seq = this.ruleForm.protein_seq.toString().trim()
      this.ruleForm.proj_name = this.ruleForm.proj_name.toString().trim()
      this.ruleForm.nucleic_seq = this.ruleForm.nucleic_seq.toString().trim()

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
          '/protein/predict/structure_submit_new/',
          //headers: { 'X-CSRFToken': window.sessionStorage.getItem('X-CSRFToken') },
          this.ruleForm
        )
        .then((res) => {
          console.log(res)
          if (res.data.status==100) {
            
          this.$message.success('Uploads Success!')
          setTimeout(() => {
            let routeData = this.$router.resolve({
              path: '/queue',
              query: {
                job_name: this.job_name,
                 program: "Structure Prediction",
              },
            })
            window.open(routeData.href, '_blank')
          }, 250)
        
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

    ExampleFrom_multi() {
      console.log(this.ruleForm.platform)
      console.log(this.props)
      this.ruleForm.proj_name = 'Job_1'
      this.ruleForm.email = 'HelloWorld@gmail.com'

      this.ruleForm.platform = ['Multimer', 'AlphaFold multimer']

      this.ruleForm.protein_seq =
        '>seqA_1\nMAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCTWTFGVDTHLATATSCTYVVKANANASQASGGPVTCGPYTITSSWSGQFGPNNGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH\n' +
        '>seqA_2\nMAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCTWTFGVDTHLATATSCTYVVKANANASQASGGPVTCGPYTITSSWSGQFGPNNGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH\n' +
        '>seqA_3\nMAAPTPADKSMMAAVPEWTITNLKRVCNAGNTSCTWTFGVDTHLATATSCTYVVKANANASQASGGPVTCGPYTITSSWSGQFGPNNGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH\n' +
        '>seqB_1\nMAAPTPADKSMMAAVPEGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH\n' +
        '>seqB_2\nMAAPTPADKSMMAAVPEGFTTFAVTDFSKKLIVWPAYTDVQVQAGKVVSPNQSYAPANLPLEHHHHHH\n'
    },

    ExampleFrom_mono() {
      this.ruleForm.proj_name = 'Job_1'
      this.ruleForm.email = 'HelloWorld@gmail.com'
      this.ruleForm.platform = ['RF2NA']
      this.ruleForm.nucleic_seq = ">RNA\nGAGAGAGAAGTCAACCAGAGAAACACACCAACCCATTGCACTCCGGGTTGGTGGTATATTACCTGGTACGGGGGAAACTTCGTGGTGGCCGGCCACCTGACA"
      this.ruleForm.nucleic_type = "R"
      this.ruleForm.protein_seq =
        '>Protein\nTRPNHTIYINNLNEKIKKDELKKSLHAIFSRFGQILDILVSRSLKMRGQAFVIFKEVSSATNALRSMQGFPFYDKPMRIQYAKTDSDIIAKM'
    },

    async checkProName(rule, value, callback) {
      const { data: res } = await this.$http.get(
        '/protein/predict/structure/check/',
        {
          params: { proj_name: value },
        }
      )

      if (res.isExist == 1) {
        return callback(new Error('Job name exists !'))
      } else {
        return callback()
      }
    },

    async get_token() {
      const { data: res } = await this.$http.get('/protein/get_token')

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
.sequence {
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}
</style>