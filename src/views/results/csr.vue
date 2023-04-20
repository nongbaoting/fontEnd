<template>
 <div class="container">
    <!--  -->
     
        <!-- 表格 -->
<el-row>
        <el-table
          :data="
            tableData
          "
          style="width: 100%"
          :stripe="true"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="tableKey"
           @sort-change="sortChange"
        >
          <!-- 列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column   sortable="custom" prop="seq_id" label="seq_id">
           <template slot-scope="scope">
           
               <el-link  type="success"  @click="toResult(scope.row.seq_id)">{{scope.row.seq_id}}</el-link>
            
           </template>
          </el-table-column>
          <el-table-column   sortable="custom" prop="length" label="length"></el-table-column>
            
         
          
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
            layout="total, sizes, prev, pager, next"
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
  data() {
    return {
      searchType: 'job_name',
      searchContent: '',
      loading: false,
      tableData: [],
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      tableKey: 'scrtable',
      order: 'descending',
      field: 'length',
      totalCount: 0,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    toResult(protein_id) {
      console.log(protein_id)
  

      let routeData = this.$router.resolve({
         path: '/pdbe-rcsb-domain',
        query: { 
          protein_id: protein_id, 
          request_type: 'interpro',
          request_Data_url: 'protein/api/results/csr_like/',
          request_PDB_url:'protein/api/results/csr_pdbFile/'
        },
      })
      window.open(routeData.href, '_blank')
    },
    getData() {
      this.loading = true
      console.log(this.$route.path)
      this.$http
        .get('protein/api/results/csr_like/', {
          params: {
            request_type: 'info_table',
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            field: this.field,
            order: this.order,
          },
        })
        .then((response) => {
          console.log(response.data)

          this.tableData = response.data.data
          // console.log(data)
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
      this.getData(this.pageSize, 1)
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