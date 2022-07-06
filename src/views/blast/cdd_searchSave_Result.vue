<template>
  <div class="container">
    <el-row :gutter="20"
      ><el-col :span="8"
        ><h1>
          Job Name:
          <span class="emphasize">{{ this.$route.query.job_name }}</span
          >, Program:
          <span class="emphasize">{{ this.$route.query.program }}</span>
        </h1></el-col
      >
      <!-- filter form -->
      <el-col :span="16">
        <filter-form-blast
          @filter_result="Submit()"
          @resset_result="Reset()"
          :filterForm="filterForm"
          :refName="'filterForm'"
        ></filter-form-blast>
      </el-col>
    </el-row>
    <!-- select + 分页条  -->
    <el-row :gutter="20" style="padding: 10px">
      <!--分页条 -->
      <!-- 分页 -->
      <el-col :span="14" :offset="0" style="align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next,jumper"
          :total="totalCount"
          prev-text="Prev"
          next-text="Next"
          background
        >
        </el-pagination>
      </el-col>

      <!-- select -->
      <el-col :span="10" class="weak_text">
        <el-row>
          <el-col>
            <span style="color: salmon"> {{ select_num }} </span> sequence
            selected
          </el-col>
          <el-col>
            <download-fasta :seqIDs="totalSelect"></download-fasta>
            <run-phylotree
              title="Choose a Job Name"
              mykey="phylotree"
              :seqIDs="totalSelect"
            >
            </run-phylotree>
            <el-button @click="showSelectNum('clear')"> Clear </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row :gutter="20">
      <el-col>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :key="'table' + currentPage + pageSize"
          :data="tableData"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @select="userSelect"
          @select-all="userSelect"
          @sort-change="sortChange"
          :row-key="setRowKey"
        >
          <!--  选择 -->
          <el-table-column
            label="select"
            :reserve-selection="true"
            type="selection"
            width="65"
          ></el-table-column>
          <!-- # 展开 -->

          <!-- id -->
          <el-table-column prop="protin_id" label="ID" width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="toNCBI(scope.row.protin_id)">
                {{ scope.row.protin_id }}
              </el-link>
            </template>
          </el-table-column>
          <!-- protein length -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="length"
            label="Protein Length"
            width="100"
          >
          </el-table-column>

          <!-- Description -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="desc"
            label="Description"
            width="400"
          >
          </el-table-column>
          <!-- CDD -->
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            prop="cdd_nameCat"
            label="Conserved Domains"
            width="1200"
          >
            <template slot-scope="scope">
              <gene-body
                :key="
                  'gene_body_currentPage' +
                  currentPage +
                  'pageSize' +
                  pageSize +
                  order
                "
                :dataset="scope.row.cdd_locs"
                :gene_length="scope.row.length"
                :max="max_protein_length"
                v-if="isgenebody"
              ></gene-body>
            </template>
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
const filterForm_ori = {
  target_len: {
    min: 400,
    max: 3000,
  },
  ident: {
    min: 0,
    max: 100,
  },

  domains: [
    {
      type: 'cdd_nameCat',
      value: '',
      count: 1,
      exclude: false,
    },
    {
      type: 'cdd_nameCat',
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
  field: 'cdd_nameCat',
  order: 'descending',
}
import filterForm from './components/filterForm_cddSearch.vue'
import phylotree from './components/run_phylogenetic.vue'
import download_fasta from './components/download_fasta.vue'
import gene_body from './components/gene_body.vue'
import * as d3 from 'd3'
export default {
  components: {
    'filter-form-blast': filterForm,
    'run-phylotree': phylotree,
    'download-fasta': download_fasta,
    'gene-body': gene_body,
  },
  data() {
    return {
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
      tableData: [],
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      totalCount: 0, // 总数，返回得到
      // order
      field: 'length',
      order: 'descending',
      job_name: 'myJob',
      label_identity: 'identiy',
      column_cover: true,

      searchType: 'job_name',
      searchContent: '',
      loading: false,
      tableKey: 'tableStruc',
      uuid: this.$route.query.uuid,
      multipleTable: [],
      totalSelect: [],
      pageAllprotin_id: [],
      select_num: 0,
      colors: {},
      dialogVisible_phylotree: false,

      isgenebody: false,
      max_protein_length: 0,
    }
  },
  watch: {
    tableData: function (newTableData, oldTableData) {
      this.pageAllprotin_id = newTableData.map((item) => item['protin_id'])
      this.max_protein_length = d3.max(newTableData, function (d) {
        return d['length']
      })
      // this.setColor()
      this.pageHasSelected()
    },
  },
  mounted() {
    this.queue(this.filterForm)
    this.show_labels()
  },

  methods: {
    showcell(row) {
      console.log(row.id)
      console.log(this.$refs.multipleTable)
    },
    setRowKey(row) {
      // console.log(row)
      return row.protin_id
    },

    show_labels() {
      if (this.$route.query.program == 'jackhmmer') {
        this.label_identity = 'acc'
        this.column_cover = true
      }
    },
    userSelect(val) {
      // console.log('handleSelectionChange')
      // console.log(val[0])
      let pageSelect = val.map((item) => item['protin_id'])
      let pageNotSelct = this.pageAllprotin_id.filter(
        (item) => pageSelect.indexOf(item) === -1
      )

      this.totalSelect = this.pageAllprotin_id.concat(this.totalSelect)

      this.totalSelect = this.totalSelect
        .filter(this.GLOBAL.myUnique)
        .filter((item) => pageNotSelct.indexOf(item) === -1)
      // console.log('total...', this.totalSelect.length)
      console.log(this.totalSelect)
      // this.totalSelect = this.totalSelect.concat(pageSelect).filter(this.GLOBAL.myUnique)
      this.select_num = this.totalSelect.length
    },

    pageHasSelected() {
      this.tableData.forEach((value) => {
        // this.$refs.multipleTable.toggleRowSelection(this.tableData, 'selected')
        if (this.totalSelect.indexOf(value['protin_id']) != -1) {
          // console.log('pageHasSelected value, index')
          // console.log(value)
          this.$refs.multipleTable.toggleRowSelection(value, true)
        }
      })
    },

    getAllID() {
      this.totalSelect = []
      this.$http
        .get('/protein/api/cdd/search/get_all_protin_ids/', {
          params: { uuid: this.uuid },
        })
        .then((response) => {
          let data = JSON.parse(response.data)
          this.totalSelect = data.protin_ids
          this.select_num = this.totalSelect.length
          this.pageHasSelected()
        })
    },

    showSelectNum(val) {
      if (val == 'all') {
        this.getAllID()
      } else if (val == 'clear') {
        this.totalSelect = []
        this.$refs.multipleTable.clearSelection()
        this.select_num = 0
      } else {
        this.select_num = this.totalSelect.length
      }
    },

    //cdd
    parse_cdd(region_cdd, note_cdd) {
      const spMatch = /, /
      let region_arr = region_cdd.split(', ')
      let note_arr = note_cdd.split('^^')
      // let cols = randomColor(region_arr)
      // console.log(region_arr)
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
    toCdd(cdd_id) {},

    // set color
    setColor() {
      let cdd_names = new Array()
      this.tableData.forEach((item) => {
        let region_arr = item.cdd_nameCat.split(', ')
        // let region_arr = item.cdd_names
        cdd_names = cdd_names.concat(region_arr)
      })
      let uniqCdd = cdd_names.filter(this.GLOBAL.myUnique)
      for (let i = 0; i < uniqCdd.length; i++) {
        this.colors[uniqCdd[i]] = this.GLOBAL.colorSet[i]
      }
    },
    queue(data) {
      this.showTable = true

      this.loading = true
      this.filterForm['program'] = this.$route.query.program
      this.filterForm['uuid'] = this.uuid
      this.isgenebody = false
      // // page
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      // // order
      this.filterForm['field'] = this.field
      this.filterForm['order'] = this.order

      this.$http({
        url: '/protein/api/cdd/retrieve_save/',
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          uuid: this.uuid,
          order: this.order,
          field: this.field,
        },
        method: 'get',
      }).then((response) => {
        // console.log(response.data.status)
        // console.log(response.data.data)
        this.tableData = response.data.data
        this.totalCount = response.data.totalCount
        console.log(this.tableData)
        this.isgenebody = true
        // this.plot_geneBody_in_table(this.tableData, 'protin_id')
        this.loading = false
      })
    },

    //提交
    Submit(data) {
      console.log(this.filterForm)
      this.showTable = true
      this.loading = true
      this.isgenebody = false
      this.$http
        .post('/protein/api/cdd/filter_cdd_save/', this.filterForm)
        .then((response) => {
          console.log(response.data.status)
          // console.log(response.data.data)
          // this.tableData = JSON.parse(response.data.data)
          this.tableData = response.data.data
          this.currentPage = 1
          this.totalCount = response.data.totalCount
          console.log(this.tableData)
          this.uuid = response.data.uuid
          this.filterForm.uuid = response.data.uuid
          this.isgenebody = true
          this.loading = false
        })
    },
    // Reset
    Reset(data) {
      this.uuid = this.$route.query.uuid
      this.queue()
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

    toNCBI(protin_id) {
      let href = 'https://www.ncbi.nlm.nih.gov/protein/' + protin_id
      window.open(href, '_blank')
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

    clickRow({ row, rowIndex }) {
      // console.log(row)
    },

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

.container {
  padding: 20px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

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

