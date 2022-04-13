<template>
  <div style="padding-top: 20px">
    <el-table
      :data="tableData"
      :key="'table' + currentPage + pageSize"
      @sort-change="sortChange"
      style="width: 100%"
      :stripe="true"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @row-click="onRowClick"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <el-row :gutter="20">
              <el-col :span="12"> hello </el-col>
              <el-col :span="12">
                <div
                  v-html="
                    format_algin_code(
                      props.row.seq_1,
                      props.row.pairwise,
                      props.row.seq_2
                    )
                  "
                ></div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chain_1"
        label="Input"
        sortable
        width="180"
        column-key="date"
      >
        <template slot-scope="scope">
          <el-link
            @click="
              toPlot(
                scope.row.seq_1,
                scope.row.pairwise,
                scope.row.seq_2,
                scope.row.chain_1,
                scope.row.chain_2
              )
            "
            type="success"
          >
            {{ scope.row.chain_1 }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="chain_2_pdb"
        label="PDB"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <el-link
            :href="'https://www.rcsb.org/structure/' + scope.row.chain_2_pdb"
            target="_blank"
            type="success"
          >
            {{ scope.row.chain_2_pdb + ':' + scope.row.chain_2_chain }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="RMSD"
        label="RMSD"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="tmscore_1"
        label="TMscore 1"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="tmscore_2"
        label="TMscore 2"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="cov_1"
        label="Cov 1"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="cov_2"
        label="Cov. 2"
        sortable="custom"
        :sort-orders="'ascending'"
      >
      </el-table-column>
      <el-table-column prop="cov_2" label="Cov. 2" sortable="custom">
      </el-table-column>

      <el-table-column prop="align_len" label="align Len" sortable="custom">
      </el-table-column>

      <el-table-column prop="family" label="Scope Family" width="300px">
      </el-table-column>

      <el-table-column
        prop="superfamily"
        label="Scope Superfamily"
        width="300px"
      >
      </el-table-column>
    </el-table>
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
            layout="total, sizes, prev, pager, next,jumper"
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
export default {
  props: ['uuid'],
  data() {
    return {
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      totalCount: 0, // 总数，返回得到
      tableData: [],
      field: 'tmscore_2',
      order: '',
      loading: false,
      isSort: false,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    toPlot(seq_1, pairwise, seq_2, input, target) {
      let routeData = this.$router.resolve({
        name: 'plotSimilarStructure',
        query: {
          input_pdb: input,
          db_pdb: target,
          uuid: this.uuid,
        },
        params: {
          seq_1: seq_1,
          pairwise: pairwise,
          seq_2: seq_2,
        },
      })
      window.open(routeData.href, '_blank')
    },

    getData() {
      let that = this
      this.$http({
        url: 'api/similarity/results/',
        params: {
          uuid: that.uuid,
          currentPage: this.currentPage, //默认显示页面为1
          pageSize: this.pageSize,
          order: this.order,
          isSort: this.isSort,
          field: this.field,
        },
        method: 'get',
      }).then((response) => {
        console.log(response.data.data)
        this.tableData = response.data.data
        this.totalCount = response.data.totalCount
        this.isSort = false
      })
    },

    format_algin_code(seq_1, pairwise, seq_2) {
      let arr_1 = seq_1.split('')
      let arr_2 = seq_2.split('')
      let arr_pw = pairwise.split('')
      let html = ''
      let span = 60
      let loops = Math.ceil(arr_1.length / span)
      for (let i = 0; i < loops; i++) {
        html +=
          '<pre class="code">' +
          arr_1.slice(i * span, (i + 1) * span).join('') +
          '</pre>'
        html +=
          '<pre class="code">' +
          arr_pw.slice(i * span, (i + 1) * span).join('') +
          '</pre>'
        html +=
          '<pre class="code">' +
          arr_2.slice(i * span, (i + 1) * span).join('') +
          '\n\n</pre>'
        html += '<p>\n</p>'
      }
      return html
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    onRowClick(row, column, event) {
      // console.log('son' + row)
      this.$emit('onRowClick', row) // 此处的function 为父组件上的function
    },

    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pageSize = size
      this.currentPage = 1
      this.getData()
      /*console.log(this.pageSize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.getData()
      /*console.log(this.currentPage) */
    },

    // sortchange
    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      this.order = column.order
      this.field = column.prop
      this.currentPage = 1
      this.isSort = true
      this.getData(10, 1)
      this.loading = false
    },

    clickRow({ row, rowIndex }) {
      console.log(row)
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

.code {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  border: 1px;
}
.container {
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>

<style >
.el-table .warning-row {
  background: rgb(218, 235, 243);
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>