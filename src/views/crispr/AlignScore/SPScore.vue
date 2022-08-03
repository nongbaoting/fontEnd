<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-table
          :key="'tabTMalign' + currentPage + pageSize"
          :data="tableData"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @sort-change="sortChange"
        >
          <el-table-column
            label="Chain 1"
            prop="fields.chain1"
          ></el-table-column>
          <el-table-column
            label="Chain 2"
            prop="fields.chain2_acc"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Length 1"
            prop="fields.chain1_len"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Length 2"
            prop="fields.chain2_len"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="effect Length"
            prop="fields.eff_len"
          ></el-table-column>

          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="SPe"
            prop="fields.SPe"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="SPa"
            prop="fields.SPa"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="SPb"
            prop="fields.SPb"
          ></el-table-column>

          <el-table-column label="RMSD" prop="fields.RMSD"></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="SI"
            prop="fields.seq_ID"
          ></el-table-column>
        </el-table>
        <!--分页条 -->
        <el-row :gutter="40" justify="end" style="padding: 10px">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['tool', 'filters', 'isfilter'],
  data() {
    return {
      activePath: '',
      tableData: [],
      pageSize: 10, //    每页的数据条数
      currentPage: 1, //默认显示页面为1
      totalCount: 0,
      loading: false,
      // order
      field: '',
      order: '',
    }
  },

  mounted() {
    this.getData(10, 1)
  },

  watch: {
    isfilter: function () {
      console.log('filters')
      this.getData(10, 1)
    },
  },

  methods: {
    getData(pageSize, currentPage) {
      this.loading = true
      console.log(this.$route.path)
      this.$http
        .get('crispr/api/structure/alignScore/SPScore/', {
          params: {
            pageSize: pageSize,
            currentPage: currentPage,
            field: this.field,
            order: this.order,
            tool: this.tool,
            filters: this.filters,
          },
        })
        .then((response) => {
          console.log(response.data)
          let data = JSON.parse(response.data.data)
          this.tableData = data
          this.totalCount = response.data.totalCount
          this.loading = false
        })
    },

    // sortchange
    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      this.order = column.order
      this.field = column.prop
      this.currentPage = 1
      this.getData(10, 1)
      this.loading = false
    },

    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pageSize = size
      this.currentPage = 1
      this.getData(this.pageSize, this.currentPage)
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.getData(this.pageSize, this.currentPage)
    },
  },
}
</script>

<style>
</style>