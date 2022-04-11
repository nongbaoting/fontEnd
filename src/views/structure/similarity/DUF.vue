<template>
  <div class="container">
    <el-row
      ><el-col :span="6" :offset="1"> <h1>DUF of human proteome</h1></el-col
      ><el-col :span="16">
        <el-card class="box-card">
          <el-form ref="filterForm" :model="filterForm">
            <el-row>
              <el-input
                :placeholder="'Search by Family/Superfamily Description'"
                v-model="filterForm.searchContent"
                prop="searchContent"
                class="input-with-select"
                @keyup.enter.native="rangeFilter()"
                style="text-transform: uppercase"
              >
                <!-- <el-select
                  v-model="searchType"
                  slot="prepend"
                  placeholder="select"
                >
                  <el-option label="Description" value="job_name"></el-option>
                </el-select> -->
                <template slot="append"
                  ><el-checkbox
                    slot="append"
                    prop="desc_exclude"
                    v-model="filterForm.desc_exclude"
                    >Exclude</el-checkbox
                  ></template
                >
              </el-input>
            </el-row>
            <el-row :gutter="10" style="padding-top: 10px">
              <el-col :span="8" class="center"><span> TMscore </span></el-col>

              <el-col :span="8" class="center"><span>RMSD</span></el-col>

              <el-col :span="8" class="center"><span>Seq Ident</span></el-col>
            </el-row>
            <el-row :gutter="10">
              <!-- tmscore -->
              <el-col :span="8">
                <el-col :span="10"
                  ><el-input v-model="filterForm.TMscore.min"> </el-input
                ></el-col>
                <el-col :span="1" class="inline"><span>-</span></el-col>
                <el-col :span="10"
                  ><el-input v-model="filterForm.TMscore.max">
                  </el-input></el-col
              ></el-col>
              <!-- RMSD -->
              <el-col :span="8">
                <el-col :span="10"
                  ><el-input v-model="filterForm.RMSD.min"> </el-input
                ></el-col>
                <el-col :span="2" class="inline"><span>-</span></el-col>
                <el-col :span="10"
                  ><el-input v-model="filterForm.RMSD.max"> </el-input></el-col
              ></el-col>
              <!-- SEQID -->
              <el-col :span="8">
                <el-col :span="10"
                  ><el-input v-model="filterForm.SEQID.min"> </el-input
                ></el-col>
                <el-col :span="1" class="inline"><span>-</span></el-col>
                <el-col :span="10"
                  ><el-input v-model="filterForm.SEQID.max"> </el-input></el-col
              ></el-col>
            </el-row>
            <el-row style="padding-top: 20px" justify="end" type="flex">
              <el-col :span="4"
                ><el-button type="primary" @click="rangeFilter()"
                  >Filter</el-button
                ></el-col
              >
              <el-col :span="4">
                <el-button @click="resetForm('filterForm')"
                  >Reset</el-button
                ></el-col
              >
            </el-row>
          </el-form>
        </el-card>
      </el-col></el-row
    >

    <el-row :gutter="20">
      <el-col>
        <!-- 表格 -->
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          :stripe="true"
          @row-click="clickRow"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          :key="tableKey"
          border
          @sort-change="sortChange"
        >
          <!-- 列
          <!-- 选择 -->
          <!-- # 展开 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="Classes:">
                  <span>{{ props.row.Classes }}</span>
                </el-form-item>
                <el-form-item label="Protein type:">
                  <span>{{ props.row['Protein type'] }}</span>
                </el-form-item>
                <el-form-item label="Scop Domain Length:">
                  <span>{{ props.row['target_len'] }}</span>
                </el-form-item>
                <el-form-item label="Scop Domain Coverage">
                  <span>{{ props.row.target_cov }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="uniprot_dm"
            label="Domain(DUF)"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                target="_blank"
                :href="
                  'https://www.uniprot.org/uniprot/' +
                  scope.row.uniprot_id +
                  '#structure'
                "
              >
                {{ scope.row.uniprot_dm }}
              </el-link>
            </template>
          </el-table-column>
          <!-- gene_names -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="gene_names"
            label="Genes(DUF)"
          >
          </el-table-column>

          <!-- TM score -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="TMscore"
            prop="TMscore_a"
          >
          </el-table-column>
          <!-- RMSD -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="RMSD"
            label="RMSD"
          >
          </el-table-column>
          <!-- sequence identity -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="SEQID"
            label="Senquence Identity"
          >
          </el-table-column>

          <!-- target_cov -->
          <!-- <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="target_cov"
            label="target_cov"
          >
          </el-table-column> -->
          <!-- PdbID -->
          <el-table-column
            :sort-orders="['descending', 'ascending']"
            prop="PdbID"
            label="PDB"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                target="_blank"
                :href="
                  'https://www.rcsb.org/structure/' +
                  scope.row.PdbID.substring(0, 4)
                "
              >
                {{ scope.row.PdbID }}
              </el-link>
            </template>
          </el-table-column>
          <!-- Family -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="Family"
            label="Family"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                target="_blank"
                :href="'http://scop.mrc-lmb.cam.ac.uk/term/' + scope.row.FA"
              >
                {{ scope.row.Family }}
              </el-link>
            </template>
          </el-table-column>
          <!-- Superfamily -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="Superfamily"
            label="Superfamily"
          >
          </el-table-column>
          <!-- Fold -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="Fold"
            label="Fold"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页条 -->
    <el-row :gutter="40" justify="end">
      <!-- 分页 -->
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="tableData.length"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- dialog -->
  </div>
</template>

<script>
const filterForm_ori = {
  SEQID: {
    min: 0.0,
    max: 100.0,
  },
  TMscore: {
    min: 0,
    max: 1,
  },
  RMSD: {
    min: 0,
    max: 50,
  },
  desc_exclude: false,
  searchType: 'Family',
  searchContent: '',
}
export default {
  data() {
    return {
      tableData: [],
      obtainData: [],
      currentPage: 1, //默认显示页面为1
      pagesize: 10, //    每页的数据条数

      loading: false,
      tableKey: 'tableStruc',

      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
    }
  },
  mounted() {
    this.queue()
  },

  computed: {},
  // watch: {
  //   protLen: {
  //     handler(newprotLen, oldprotLen) {
  //       this.rangeFilter(this.protLen, 'target_len')
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    // sortchange
    sortChange: function (column) {
      function compare(property, order) {
        return function (obj1, obj2) {
          var value1 = obj1[property]
          var value2 = obj2[property]
          if (order === 'ascending') {
            return value1 - value2 // 升序
          } else {
            return value2 - value1
          }
        }
      }
      function myorder_str(value1, value2) {
        if (value1 < value2) {
          return -1
        } else if (value1 > value2) {
          return 1
        } else {
          return 0
        }
      }
      function compare_str(property, order) {
        return function (obj1, obj2) {
          let value1 = obj1[property].toUpperCase()
          let value2 = obj2[property].toUpperCase()
          if (order === 'ascending') {
            return myorder_str(value1, value2) // 升序
          } else {
            return myorder_str(value2, value1)
          }
        }
      }
      // console.log(column.column + '-' + column.prop + '-' + column.order)
      // console.log(typeof this.tableData[0][column.prop])
      this.loading = true
      if (typeof this.tableData[0][column.prop] === 'string') {
        this.tableData.sort(compare_str(column.prop, column.order))
        // console.log('string')
      } else {
        this.tableData.sort(compare(column.prop, column.order))
      }

      this.loading = false
    },

    rangeFilter() {
      this.loading = true
      let arr = new Array()
      for (let i = 0; i < this.obtainData.length; i++) {
        if (
          // true
          this.obtainData[i]['TMscore_a'] > this.filterForm.TMscore.min &&
          this.obtainData[i]['TMscore_a'] < this.filterForm.TMscore.max &&
          this.obtainData[i].SEQID > this.filterForm.SEQID.min &&
          this.obtainData[i].SEQID < this.filterForm.SEQID.max &&
          this.obtainData[i].RMSD > this.filterForm.RMSD.min &&
          this.obtainData[i].RMSD < this.filterForm.RMSD.max
        ) {
          arr.push(this.obtainData[i])
        }
      }
      this.tableData = arr
      this.descFilter()
      this.loading = false
    },

    descFilter() {
      if (!this.filterForm.searchContent) {
        return
      }
      let arr = new Array()
      let arr_ex = new Array()

      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i][this.filterForm.searchType]
            .toUpperCase()
            .indexOf(this.filterForm.searchContent.toUpperCase()) != -1 ||
          this.tableData[i]['Superfamily']
            .toUpperCase()
            .indexOf(this.filterForm.searchContent.toUpperCase()) != -1 ||
          this.tableData[i]['Fold']
            .toUpperCase()
            .indexOf(this.filterForm.searchContent.toUpperCase()) != -1
        ) {
          arr.push(this.tableData[i])
        } else {
          arr_ex.push(this.tableData[i])
        }
      }
      if (!this.filterForm.desc_exclude) {
        this.tableData = arr
      } else {
        this.tableData = arr_ex
      }
    },

    clickRow({ row, rowIndex }) {
      console.log(row)
    },

    queue() {
      this.loading = true

      let that = this
      this.$http
        .get('api/similarity/DUF_SPalign/', {
          params: { uuid: that.$route.query.uuid, program: 'jackhmmer' },
        })
        .then((response) => {
          this.tableData = response.data.data
          this.obtainData = response.data.data
          console.log(this.obtainData)

          this.loading = false
        })
    },
    resetForm(formName) {
      console.log(this.$refs[formName])

      // this.$refs[formName].resetFields()
      this.filterForm = JSON.parse(JSON.stringify(filterForm_ori))
      this.rangeFilter()
    },

    // tableRowClassName({ row, rowIndex }) {
    //   if (row.fields.running_date && !row.fields.completed_date) {
    //     return 'success-row'
    //   }
    //   return ''
    // },
    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pagesize = size
      /*console.log(this.pagesize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      /*console.log(this.currentPage) */
    },
  },
}
</script>

<style lang="less" scoped>
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

// .input-with-select .el-input-group__prepend {
//   background-color: #fff;
// }
.container {
  padding: 20px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

.center {
  text-align: center;
}
/deep/ .el-card__header {
  padding: 10px 10px;
}

/deep/ .el-card__body {
  padding: 10px;
}

/deep/ .el-card {
  padding: 0px;
}
.inline {
  padding: 0px;
  margin: 0px;
  text-align: center;
}

.box-card {
  margin-bottom: 10px;
}
</style>

<style >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 200px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table .warning-row {
  background: rgb(218, 235, 243);
}

.el-table .success-row {
  background: #f0f9eb;
}
.searchBox {
  padding: 0px;
  margin: 0px;
}
.code {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  border: 1px;
}
</style>