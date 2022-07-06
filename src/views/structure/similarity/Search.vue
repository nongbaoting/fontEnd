<template>
  <div style="padding-top: 20px">
    <el-row id="app_form_predict" class="align_center">
      <el-col :span="18" :offset="3">
        <h2 class="title">Protein Structure Similarity Search</h2>
        <el-row>
          <!-- 搜索框 -->
          <el-col :span="12" :offset="6">
            <el-input
              v-model="searchContent"
              class="input-with-select"
              @keyup.enter.native="searchJob"
              style="text-transform: uppercase"
            >
              <el-select
                v-model="searchType"
                slot="prepend"
                placeholder="select"
              >
                <el-option label="Gene Symbol" value="gene_name"></el-option>
                <el-option label="Protein ID" value="pdb_id"></el-option>
                <el-option label="Structure ID" value="pdb_id"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchJob"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Structure_prediction',
  data() {
    return {
      searchType: 'Gene Symbol',
      searchContent: '',
      loading: false,

      rules: {
        proj_name: [
          {
            // required: true,
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
    submitForm(formName) {
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
          '/protein/predict/structure_submit/',
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

    async get_token() {
      const { data: res } = await this.$http.get('/protein/get_token')

      window.sessionStorage.setItem('X-CSRFToken', res.token)
    },
  },
}
</script>

<style lang="less" scoped>
.align_center {
  align-items: center;
  text-align: center;
}

.toggle_box {
  border: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}
.on_bottom {
  display: flex;
  align-items: flex-end;
}

.searchPageBar {
  padding-top: 15px;
  padding-left: 10px;
}

.pagination {
  padding-top: 10px;
}
.el-select {
  width: 140px;
}
</style>