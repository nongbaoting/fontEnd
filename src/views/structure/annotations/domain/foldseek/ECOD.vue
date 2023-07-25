<template>
  <div>
    <!-- <h1>Hello</h1> -->
    <el-row>
      <el-col>
        <!-- 表格 -->

        <el-table
          :data="tableData"
          style="width: 100%"
          @row-click="clickRow"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="tableKey"
          @sort-change="sortChange"
        >
          <!-- 列 -->
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column sortable="custom" prop="ecod_domain_id" label="ECOD">
            <template slot-scope="scope">
              <!-- 如果出现完completed_date就现实连接 -->
              <!-- 跳转链接 -->
              <el-link
                type="primary"
                target="_blank"
                :href="
                  'http://prodata.swmed.edu/ecod/complete/domain/' +
                  scope.row.ecod_domain_id
                "
              >
                ECOD
              </el-link>

              <!-- 否者现实弹框 -->
            </template>
          </el-table-column>

          <el-table-column sortable="custom" prop="qstart" label="qStart">
          </el-table-column>
          <el-table-column sortable="custom" prop="qend" label="qEnd">
          </el-table-column>
          <el-table-column sortable="custom" prop="prob" label="Probability">
          </el-table-column>
          <el-table-column sortable="custom" prop="ttmscore" label="tTMscore">
          </el-table-column>

          <el-table-column
            width="240"
            sortable="custom"
            prop="f_name"
            label="Family"
          >
          </el-table-column>
          <el-table-column
            width="240"
            sortable="custom"
            prop="t_name"
            label="Domain"
          >
          </el-table-column>

          <el-table-column>
            <template>
              <el-button type="warning" size="small" round> Align </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页条 -->
    <el-row :gutter="40" justify="end">
      <!-- 分页 -->
      <el-col>
        <div>
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

    <el-row>
      <h3>alignment</h3>
      <protein-body-view :dataset="tableData"></protein-body-view>
    </el-row>
  </div>
</template>

<script>
import proteinBodyVue from './proteinBody.vue'

export default {
  components: {
    'protein-body-view': proteinBodyVue,
  },
  props: ['viewkey', 'protein_id', 'request_Data_url'],
  data() {
    return {
      // for table
      tableData: [],
      totalCount: 0,
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      order: 'descending',
      field: 'ttmscore',
      is_sort: false,
      tableKey: 'ecod_table',
      loading: true,
      // end table
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http
        .get(this.request_Data_url, {
          params: {
            uuid: this.protein_id,
            request_type: 'ECOD',

            // table
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            order: this.order,
            field: this.field,
            is_sort: this.is_sort,
            // end table
          },
        })
        .then((res) => {
          console.log(res.data)
          // let data = JSON.parse(res.data)
          // this.rowConfigData = res.data.rowConfigData
          // this.sequence = res.data.sequence
          this.tableData = res.data.data
          this.totalCount = res.data.totalCount
          this.loading = false
          this.is_sort = false
          console.log(this.tableData)
        })
    },

    toResult(row) {
      console.log(row)
      //   let mypath = pathDt[proj_type]
      //   let routeData = this.$router.resolve({
      //     path: mypath,
      //     query: {
      //       uuid: uuid,
      //       job_name: job_name,
      //       run_status: run_status,
      //       program: proj_type,
      //       datetime: datetime,
      //     },
      //   })
      //   window.open(routeData.href, '_blank')
    },

    // sortchange
    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      this.order = column.order
      this.field = column.prop
      this.is_sort = true
      this.currentPage = 1
      this.getData()
      this.loading = false
    },

    clickRow(row, column, event) {
      console.log(row)
      console.log(column)
      let e = {
        chain: 'A',
        color: '#d95f02',
        start: row.qstart,
        end: row.qend,
      }
      this.$emit('clickOnFoldseekMatch', e)
    },
    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pagesize = size
      this.getData()
      /*console.log(this.pagesize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.getData()
      /*console.log(this.currentPage) */
    },
  },
}
</script>

<style>
</style>