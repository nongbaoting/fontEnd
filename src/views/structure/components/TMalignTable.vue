<template>
  <div style="padding-top: 40px">
    <el-button>Similar Structures:</el-button>
    <!-- <el-button @click="resetDateFilter" style="margin-left: 20px"
      >清除日期过滤器</el-button
    > -->
    <el-button @click="clearFilter" style="margin-left: 20px"
      >Clear Filters</el-button
    >
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 100%"
      :stripe="true"
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
      <el-table-column prop="chain_2_pdb" label="PDB" sortable>
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
      <el-table-column prop="RMSD" label="RMSD" sortable> </el-table-column>
      <el-table-column prop="tmscore_1" label="TMscore 1" sortable>
      </el-table-column>
      <el-table-column prop="tmscore_2" label="TMscore 2" sortable>
      </el-table-column>
      <el-table-column prop="cov_1" label="Cov 1" sortable> </el-table-column>
      <el-table-column prop="cov_2" label="Cov. 2" sortable> </el-table-column>
      <el-table-column prop="cov_2" label="Cov. 2" sortable> </el-table-column>

      <el-table-column prop="align_len" label="align Len" sortable>
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
    <el-row style="padding-top: 20px">
      <p>结构显示有些bug,看score值为准。</p>
      <p>
        <b> Geom score, CN score </b>were described in : Guzenko, D., Burley, S.
        K. & Duarte, J. M. Real time structural search of the Protein Data Bank.
        PLOS Comput. Biol. 16, e1007970 (2020).
      </p>
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
      tableData: [],
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
        },
        method: 'get',
      }).then((response) => {
        console.log(response.data.data)
        this.tableData = response.data.data
      })
    },

    format_linkTarget(target, source) {
      if (source == 'PDB') {
        return 'https://www.rcsb.org/structure/' + target
      } else {
        return 'https://alphafold.ebi.ac.uk/entry/' + target
      }
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
      /*console.log(this.pageSize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      /*console.log(this.currentPage) */
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