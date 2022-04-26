<template>
  <div class="container">
    <!-- 搜索框 -->
    <el-row :gutter="20" style="height: 400px">
      <el-col :span="18" :offset="3">
        <el-card class="box-card">
          <el-form ref="filterForm_cdd" :model="filterForm">
            <!-- TODO input title -->
            <el-row :gutter="5" class="align_text_center"
              ><el-col :span="4"><span>Key word type</span></el-col
              ><el-col :span="8">Key word</el-col>
              <el-col :span="6">Count</el-col>
              <el-col :span="4">
                <el-button icon="el-icon-plus" @click.prevent="addDomain()"
                  >Add Keyword</el-button
                >
              </el-col>
            </el-row>
            <el-form-item
              v-for="(domain, index) in filterForm.domains"
              :key="'cdd_domains.' + index + '.value'"
              :prop="'domains.' + index + '.value'"
            >
              <el-row :gutter="5">
                <el-col :span="18">
                  <el-input
                    :placeholder="'Search by CDD Keyword'"
                    v-model="domain.value"
                    prop="searchContent"
                  >
                    <el-select v-model="domain.type" slot="prepend"
                      ><el-option label="CDD Name" value="cdd_name"></el-option>
                      <el-option
                        label="CD Description"
                        value="cdd_desc_short"
                      ></el-option>
                    </el-select>

                    <el-input-number
                      controls-position="right"
                      :min="1"
                      slot="append"
                      prop="domain.count"
                      v-model="domain.count"
                    ></el-input-number>
                  </el-input>
                </el-col>

                <el-col :span="2.5">
                  <el-checkbox
                    border
                    prop="domain.exclude"
                    v-model="domain.exclude"
                    >Exclude</el-checkbox
                  >
                </el-col>

                <el-col :span="2.5" v-if="index > 0"
                  ><el-button @click.prevent="removeDomain(domain)"
                    >Delete</el-button
                  ></el-col
                >
              </el-row>
            </el-form-item>
            <el-form-item label="Protein Length" label-width="140px">
              <el-row :gutter="0">
                <!-- Target Length  -->
                <!-- TODO  traget lenth-->
                <el-col :span="16">
                  <el-col :span="10"
                    ><el-input
                      v-model="filterForm.target_len.min"
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
                      type="number"
                      v-model="filterForm.target_len.max"
                    >
                      <el-button slot="prepend">Max:</el-button>
                    </el-input></el-col
                  ></el-col
                >
              </el-row>
            </el-form-item>
            <!-- source -->
            <el-form-item
              label-width="140px"
              label="CD Source:"
              props="filterForm.anno_source"
            >
              <el-select v-model="filterForm.anno_source" style="width: 400px">
                <el-option label="ALL (58235 PSSMs)" value="all"></el-option>
                <el-option
                  label="NCBI_Curated (17937 PSSMs)"
                  value="ncbi"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label-width="140px"
              label="Job Name"
              props="filterForm.job_name"
            >
              <el-input type="text" v-model="filterForm.job_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-col :span="6"
                ><el-button type="primary" @click="Submit()"
                  >Search CDD</el-button
                ></el-col
              >
              <el-col :span="4">
                <el-button @click="resetForm('filterForm_cdd')"
                  >Reset</el-button
                ></el-col
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const filterForm_ori = {
  target_len: {
    min: 400,
    max: 3000,
  },

  domains: [
    {
      type: 'cdd_name',
      value: 'cas7',
      count: 1,
      exclude: false,
    },
    {
      type: 'cdd_name',
      value: '',
      count: 1,
      exclude: false,
    },
  ],

  anno_source: 'all',
  currentPage: 1,
  pageSize: 10,
  uuid: '',
  field: 'length',
  order: 'descending',

  job_name: 'test',
}

export default {
  data() {
    return {
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
    }
  },

  methods: {
    //提交
    Submit() {
      console.log(this.filterForm)
      this.$http
        .post('api/cdd/search_save/', this.filterForm)
        .then((response) => {
          console.log(response.status)
          if (response.status === 200) {
            let routeData = this.$router.resolve({
              path: '/queue',
              query: {
                program: 'CD Search',
              },
            })
            window.open(routeData.href, '_blank')
          } else {
            this.$message({
              message: 'error! code: ' + response.status,
              duration: 2000,
              type: 'error',
            })
          }
        })
    },

    removeDomain(item) {
      var index = this.filterForm.domains.indexOf(item)
      if (index > 0) {
        this.filterForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.filterForm.domains.push({
        type: 'cdd_name',
        value: '',
        count: 1,
        exclude: false,
        // key: Date.now(),
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)

      this.order = column.order
      this.field = column.prop
      this.currentPage = 1
      this.pages()
    },
  },
}
</script>

<style >
.center {
  /* text-align: center; */
}

.el-select {
  width: 140px;
}
</style>