<template>
  <div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="10" :offset="6">
        <h2 class="title">Protein Structure Domain Annotations</h2>
        <!-- 提交 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm_domain_annotation"
          label-width="120px"
          class="demo-ruleForm"
          label-position="right"
        >
          <!-- 文件 -->
          <el-form-item label="Upload Files" prop="upload_file">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="string"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
              :auto-upload="false"
              :multiple="multiple"
              :limit="limit"
              :accept="accept"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                @click="selectPdbFiles"
                >Select File</el-button
              >

              <!-- <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                slot="trigger"
                @click="selectZip"
                >Select File (.zip)</el-button
              > -->
              <div slot="tip" class="el-upload__tip" style="line-height: 1.3">
                Protein structure files in
                <span class="p_em">.bcif, .pdb, .cif</span> format ( compression
                in <span class="p_em">.gz</span> is also supported ) <br />
                or packaging in a single <span class="p_em">.zip</span> file.
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item label="Chain">
            <el-input v-model="ruleForm.chain"></el-input>
          </el-form-item>

          <!-- 程序选择 -->

          <!-- 项目名 -->
          <el-form-item label="Job Name">
            <el-input v-model="ruleForm.job_name"></el-input>
          </el-form-item>
          <!-- email -->
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="ruleForm.email"
              type="email"
              auto-complete="on"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm_domain_annotation')"
              >Summit</el-button
            >
            <el-button @click="resetForm('ruleForm_domain_annotation')"
              >Reset</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import similarityTable from '../components/similarityTable.vue'
import nglView from '../components/ngl_superpositon.vue'
// const cityOptions = ['SPalign NS', 'BioZernike']
const cityOptions = ['TMalign']
export default {
  name: 'Structure_prediction',
  data() {
    return {
      checkAll: false,
      checkedCities: ['TMalign'],
      cities: cityOptions,
      isIndeterminate: true,
      accept: '.pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,',
      limit: 100,
      multiple: false,
      fileList: [],
      // children: similarityTable
      tableData: [],

      // children: ngl
      input: '',
      target: '',
      input_file: '',
      target_file: '', // PDB: 'data/pdb/','AlphaFold 2': 'alphafold',

      showResult: false,
      ruleForm: {
        job_name: 'test-domain-annotation',
        email: '',
        chain: 'A',
      },
      rules: {
        job_name: [
          {
            required: true,
            message: 'Please input a job name!',
            trigger: 'blur',
          },

          {
            min: 2,
            max: 20,
            message: 'length 2 to 20 characters',
            trigger: 'blur',
          },
          //   { validator: this.checkProName, trigger: 'blur' },
        ],
        chain: [{ required: true }],
        email: [
          {
            type: 'email',
            message: 'please input valid email address!',
            trigger: 'change',
          },
        ],
      },
    }
  },

  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    // 文件
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    handlePreview(file) {
      console.log(file)
    },

    handleChange(file, fileList) {
      this.fileList = fileList
    },

    // 自定义上传开关
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.upload_pdb()
        } else {
          this.$message.error('error input!')
          return false
        }
      })
    },

    handleSuccess(response, file, fileList) {
      console.log(response.msg)
      console.log(file)
      console.log(fileList)
    },

    //table发生改变
    clickTableRow(row) {
      this.input = row.input
      this.input_file = row.input_file
      this.target = row.target
      this.target_file = row.target_file
    },

    // 自定义上传方法
    upload_pdb() {
      console.log(this.fileList)
      if (this.fileList.length === 0) {
        return this.$message.error('Please select at least one file!')
      }
      const formData = new FormData()
      // 添加文件
      this.fileList.forEach((file) => {
        formData.append('file', file.raw)
      })
      // 添加自定义参数
      formData.append('job_name', this.ruleForm.job_name)
      formData.append('email', this.ruleForm.email)
      formData.append('chain', this.ruleForm.chain)

      this.$http({
        url: 'protein/api/pdb_domain_annotations/uploadPDB_and_annotation/',
        method: 'POST',
        data: formData,
      }).then((res) => {
        // console.log(res)
        if (res.status == 200) {
          this.$message.success('Uploads Success!')

          let routeData = this.$router.resolve({
            path: '/queue',
            query: {
              job_name: this.job_name,
              program: 'PDB Domain Annotations',
            },
          })
          window.open(routeData.href, '_blank')
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles()
      this.tableData = []
      this.showResult = false
    },

    selectZip() {
      this.limit = 1
      this.multiple = false
      this.$refs.upload.clearFiles()
      this.accept = '.zip'
    },
    selectPdbFiles() {
      this.multiple = true
      this.limit = 100
      this.accept = '.pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,'
    },
    async checkProName(rule, value, callback) {
      const { data: res } = await this.$http.get(
        '/protein/predict/structure/check/',
        {
          params: { job_name: value },
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

  components: {
    'similarity-table': similarityTable,
    'ngl-view': nglView,
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

.title {
  text-align: center;
}
.p_em {
  font-weight: bold;
}
</style>