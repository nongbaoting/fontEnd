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
          <el-table-column   sortable="custom" prop="chain_2" label="chain_2">
           <template slot-scope="scope">
           
               <el-link  type="success"  @click="toResult(scope.row.chain_2)">{{scope.row.chain_2}}</el-link>
            
           </template>
          </el-table-column>
          <el-table-column   sortable="custom" prop="chain_2_len" label="chain_2_len"></el-table-column>
             <el-table-column   sortable="custom" prop="TMalign_cov_1" label="cov_1">
          </el-table-column>
             <el-table-column   sortable="custom" prop="TMalign_TMscore_1" label="TMscore 1">
          </el-table-column>
            <el-table-column   sortable="custom" prop="Seq_ID" label="identity"></el-table-column>
          <el-table-column   sortable="custom" prop="RMSD" label="RMSD"></el-table-column>
         
          <el-table-column   sortable="custom" prop="isDNAdomain" label="isDNAdomain"></el-table-column>
          <el-table-column   sortable="custom" width="340" prop="interPro_description" label="interPro"></el-table-column>
          <el-table-column   sortable="custom"  width="340"  prop="description" label="description"></el-table-column>
          <el-table-column   sortable="custom" prop="Analysis" label="Analysis"></el-table-column>
          
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
      tableKey: 'tableTadA_like',
      order: 'descending',
      field: 'TMalign_TMscore_1',
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
        query: { protein_id: protein_id, 
        request_type: 'interpro',
        request_url:'',
        },
      })
      window.open(routeData.href, '_blank')
    },
    getData() {
      this.loading = true
      console.log(this.$route.path)
      this.$http
        .get('protein/api/results/tada_like/', {
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