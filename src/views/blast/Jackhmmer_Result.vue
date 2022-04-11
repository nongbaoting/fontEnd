<template>
  <div class="container">
    <el-row :gutter="20"
      ><el-col :span="8"
        ><h1>
          Project Name:
          <span class="emphasize">{{ this.$route.query.proj_name }}</span
          >, Program:
          <span class="emphasize">{{ this.$route.query.program }}</span>
        </h1></el-col
      >
      <!-- filter form -->
      <el-col :span="16">
        <filter-form-blast
          @filter_result="queue()"
          :filterForm="filterForm"
          :refName="'filterForm'"
        ></filter-form-blast>
      </el-col>
    </el-row>
    <!--分页条 -->
    <el-row :gutter="40" type="flex" class="row-bg" justify="end">
      <!-- 分页 -->
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager,  next, jumper"
            :total="totalCount"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row :gutter="20">
      <el-col>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          :stripe="true"
          @row-click="clickRow"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="tableKey"
          border
          @sort-change="sortChange"
        >
          <!-- 列
          <!-- 选择 -->
          <!-- # 展开 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-for="key in props.row.pairwise">
                <pre class="code">{{ key }}</pre>
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column prop="target" label="ID">
            <template slot-scope="scope">
              <el-link
                type="primary"
                target="_blank"
                :href="
                  'https://www.ncbi.nlm.nih.gov/protein/' + scope.row.target
                "
              >
                {{ scope.row.target }}
              </el-link>
            </template>
          </el-table-column>
          <!-- Description -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="desc"
            label="Description"
            width="600"
          >
          </el-table-column>
          <!-- CDD -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="cdd_annots"
            label="CDD"
            width="800"
          >
            <template slot-scope="scope">
              <el-row>
                <el-popover
                  trigger="hover"
                  placement="top"
                  v-for="item in parse_cdd(
                    scope.row.cdd_annots,
                    scope.row.cdd_notes
                  )"
                >
                  <p>
                    Description:
                    {{ item.note }}
                  </p>
                  <el-button
                    slot="reference"
                    class="no_space_button"
                    :style="'background-color:' + item.cdd_color"
                    >{{ item.cdd }}</el-button
                  >
                </el-popover>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="query_covery"
            label="Query cover"
          >
          </el-table-column>
          <!-- protein length -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="target_len"
            label="Subject Length"
          >
          </el-table-column>
          <!-- identity -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="acc"
            label="ACC"
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
            :page-size="pageSize"
            layout="total, sizes, prev, pager, jumper, next"
            :total="totalCount"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import filterForm from './components/filterForm_blast.vue'

const filterForm_ori = {
  target_len: {
    min: 400,
    max: 10000,
  },
  ident: {
    min: 0,
    max: 100,
  },

  domains: [
    {
      type: 'cdd_annots',
      value: '',
      count: 1,
      exclude: false,
    },
    {
      type: 'cdd_annots',
      value: '',
      count: 1,
      exclude: false,
    },
  ],

  uuid: '',
  program: '',
  // page
  currentPage: 1,
  pageSize: 10,
  // order
  field: 'cdd_annots',
  order: 'descending',
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}
var set3 = [
  '#8DD3C7',
  '#FFFFB3',
  '#BEBADA',
  '#FB8072',
  '#80B1D3',
  '#FDB462',
  '#B3DE69',
  '#FCCDE5',
  '#D9D9D9',
  '#BC80BD',
  '#CCEBC5',
  '#FFED6F',
  '#1B9E77',
  '#D95F02',
  '#7570B3',
  '#E7298A',
  '#66A61E',
  '#E6AB02',
  '#A6761D',
  '#666666',
]
function randomColor(keys) {
  let col = {}
  let set3 = [
    '#8DD3C7',
    '#FFFFB3',
    '#BEBADA',
    '#FB8072',
    '#80B1D3',
    '#FDB462',
    '#B3DE69',
    '#FCCDE5',
    '#D9D9D9',
    '#BC80BD',
    '#CCEBC5',
    '#FFED6F',
    '#1B9E77',
    '#D95F02',
    '#7570B3',
    '#E7298A',
    '#66A61E',
    '#E6AB02',
    '#A6761D',
    '#666666',
  ]
  let uniqKeys = keys.filter(onlyUnique)
  for (let j = 0; j < uniqKeys.length; j++) {
    col[uniqKeys[j]] = set3[j]
  }
  return col
}

export default {
  components: {
    'filter-form-blast': filterForm,
  },
  data() {
    return {
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
      tableData: [],

      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      totalCount: 0, // 总数，返回得到
      // order
      field: 'cdd_annots',
      order: 'descending',

      searchType: 'job_name',
      searchContent: '',
      loading: false,
      tableKey: 'tableStruc',
      formInline: { user: '', region: '' },
      ident: {
        min: 0.0,
        max: 100,
      },
      query: {
        min: 0,
        max: 100,
      },
      protLen: {
        min: 400,
        max: 100000,
      },
      evalue: { cutoff: 1e-3 },
      ident_dialogVisible: false,
      query_dialogVisible: false,
      protLen_dialogVisible: false,
      evalue_dialogVisible: false,
      desc_exclude: true,
      colors: {},
    }
  },

  mounted() {
    this.queue(this.filterForm)
    // this.parse_cdd()
  },

  methods: {
    //cdd
    parse_cdd(region_cdd, note_cdd) {
      const spMatch = /, /
      let region_arr = region_cdd.split(', ')
      let note_arr = note_cdd.split('^^')
      let cols = randomColor(region_arr)
      // console.log(cols)
      let region_dt = new Array()
      for (var i = 0; i < region_arr.length; i++) {
        region_dt.push({
          cdd: region_arr[i],
          cdd_color: this.colors[region_arr[i]],
          note: note_arr[i],
        })
      }
      return region_dt
    },
    // set color
    setColor() {
      let cdd_names = new Array()
      this.tableData.forEach((item) => {
        let region_arr = item.cdd_annots.split(', ')
        cdd_names = cdd_names.concat(region_arr)
      })
      let uniqCdd = cdd_names.filter(onlyUnique)
      for (let i = 0; i < uniqCdd.length; i++) {
        this.colors[uniqCdd[i]] = set3[i]
      }
    },
    queue(data) {
      this.showTable = true
      this.loading = true
      this.filterForm['program'] = this.$route.query.program
      this.filterForm['uuid'] = this.$route.query.uuid

      // // page
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      // // order
      this.filterForm['field'] = this.field
      this.filterForm['order'] = this.order
      //filter

      this.$http
        .post('api/blast/res/blast_jackhmmer/', this.filterForm)
        .then((response) => {
          console.log(response.data.status)
          // console.log(response.data.data)
          this.tableData = response.data.data
          this.totalCount = response.data.totalCount
          console.log(this.tableData)
          this.setColor()
          this.loading = false
        })
    },
    //
    changeCellStyle(row, column, rowIndex, columnIndex) {
      // console.log(row.column.label)
      if (row.column.label === 'CDD') {
        return {
          padding: '0px 0',
          margin: '0px',
          // 'background-color': 'salmon',
          'line-height': '26px',
        } // 修改的样式
      } else {
        return ''
      }
    },
    // sortchange
    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      this.order = column.order
      this.field = column.prop
      this.currentPage = 1
      this.queue(10, 1)
      this.loading = false
    },

    sortChange1: function (column) {
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
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      if (column.prop === 'desc') {
        this.tableData.sort(compare_str(column.prop, column.order))
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
          this.obtainData[i]['target_len'] > this.protLen.min &&
          this.obtainData[i]['target_len'] < this.protLen.max &&
          this.obtainData[i].acc > this.ident.min &&
          this.obtainData[i].acc < this.ident.max &&
          this.obtainData[i].E_value < this.evalue.cutoff
        ) {
          arr.push(this.obtainData[i])
        }
      }
      this.tableData = arr
      this.descFilter()
      this.loading = false
    },

    descFilter() {
      if (!this.searchContent) {
        return
      }
      let arr = new Array()
      let arr_ex = new Array()

      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i]['desc']
            .toUpperCase()
            .indexOf(this.searchContent.toUpperCase()) != -1
        ) {
          arr.push(this.tableData[i])
        } else {
          arr_ex.push(this.tableData[i])
        }
      }
      if (!this.desc_exclude) {
        this.tableData = arr
      } else {
        this.tableData = arr_ex
      }
    },

    clickRow({ row, rowIndex }) {
      // console.log(row)
    },

    // queue(pageSize, currentPage) {
    //   this.loading = true
    //   console.log(this.$route.query.program)
    //   let that = this
    //   this.$http
    //     .post('api/blast/res/blast_jackhmmer/', {
    //       params: {
    //         uuid: this.$route.query.uuid,
    //         program: this.$route.query.program,
    //         // page
    //         pageSize: pageSize,
    //         currentPage: currentPage,
    //         // order
    //         field: this.field,
    //         order: this.order,
    //         //filter
    //         ident_min: this.ident.min,
    //         ident_max: this.ident.max,
    //         protLen_min: this.protLen.min,
    //         protLen_max: this.protLen.max,
    //         evalue: this.evalue.cutoff,
    //         searchContent: this.searchContent,
    //         desc_exclude: this.desc_exclude,
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response.data.status)
    //       let status = response.data.status
    //       if (status == 200) {
    //         this.tableData = response.data.data
    //         this.totalCount = response.data.totalCount

    //         console.log(this.tableData)
    //       }
    //       this.loading = false
    //     })
    // },

    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pageSize = size
      this.currentPage = 1
      this.queue(this.filterForm)
      /*console.log(this.pageSize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.queue(this.filterForm)
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

// /deep/ .el-table .el-table__cell {
//   padding: 0px 0;
//   min-width: 0;
//   box-sizing: border-box;
//   text-overflow: ellipsis;
//   vertical-align: middle;
//   position: relative;
//   text-align: left;
// }

.no_space_button {
  padding: 10px 10px;
  margin: 0px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
  height: 100%;
}

.no_space {
  padding: 10px 2px;
  margin: 0px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
  height: 100%;
  display: flex-start;
}
.el-pagination {
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}
.emphasize {
  color: salmon;
}
</style>

<style >
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

