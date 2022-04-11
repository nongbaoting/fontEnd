<template>
  <div>
    <el-button>Similar Structures:</el-button>
    <!-- <el-button @click="resetDateFilter" style="margin-left: 20px"
      >清除日期过滤器</el-button
    > -->
    <el-button @click="clearFilter" style="margin-left: 20px"
      >Clear Filters</el-button
    >
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%"
      :stripe="true"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @row-click="onRowClick"
    >
      <el-table-column
        prop="input"
        label="Input"
        sortable
        width="180"
        column-key="date"
      >
      </el-table-column>
      <el-table-column prop="target" label="Target" sortable>
        <!-- <template slot-scope="scope">
          <el-link
            :href="format_linkTarget(scope.row.target, scope.row.source)"
            target="_blank"
            type="success"
          >
            {{ scope.row.target }}
          </el-link>
        </template> -->
      </el-table-column>
      <el-table-column prop="geo_score" label="Geom Score" sortable>
      </el-table-column>
      <el-table-column prop="total_score" label="CN Score" sortable>
      </el-table-column>

      <!-- <el-table-column prop="cn_score" label="Uniprot" sortable>
      </el-table-column>
      <el-table-column prop="cn_score" label="Gene Names" sortable>
      </el-table-column> -->

      <el-table-column prop="source" label="Source" sortable>
        <template slot-scope="scope">
          <el-link
            :href="format_linkTarget(scope.row.target, scope.row.source)"
            target="_blank"
            type="success"
          >
            {{ scope.row.source }}
          </el-link>
        </template>
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
  props: ['tableData'],
  data() {
    return {
      currentPage: 1, //默认显示页面为1
      pagesize: 10, //    每页的数据条数
    }
  },
  methods: {
    format_linkTarget(target, source) {
      if (source == 'PDB') {
        return 'https://www.rcsb.org/structure/' + target
      } else {
        return 'https://alphafold.ebi.ac.uk/entry/' + target
      }
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
      this.pagesize = size
      /*console.log(this.pagesize) */
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

// .input-with-select .el-input-group__prepend {
//   background-color: #fff;
// }
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