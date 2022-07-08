<template>
  <div class="container">
    <el-row
      :gutter="20"
      class="searchPageBar"
      type="flex"
      justify="space-between"
    >
      <!-- 搜索框 -->
      <el-col :span="12">
        <el-input
          :placeholder="'Search by your ' + searchType_show()"
          v-model="searchContent"
          class="input-with-select"
          @keyup.enter.native="searchJob"
          style="text-transform: uppercase"
        >
          <el-select v-model="searchType" slot="prepend" placeholder="select">
            <el-option label="Job Name" value="job_name"></el-option>
            <el-option label="Email Address" value="email_addr"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchJob"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 选择分类按钮 -->
      <el-col :span="12">
        <el-row :gutter="50" type="flex" justify="center">
          <el-button plain @click="queue()">All</el-button>
          <el-button type="primary" plain @click="queryJob('running_date')"
            >Active</el-button
          >
          <el-button type="warning" plain @click="queryJob('pending')"
            >Pending</el-button
          >
          <el-button type="success" plain @click="queryJob('completed_date')"
            >Success</el-button
          >
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <!-- 表格 -->

        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :stripe="true"
          @row-click="clickRow"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="tableKey"
        >
          <!-- 列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column sortable prop="fields.job_name" label="Job Name">
            <template slot-scope="scope">
              <!-- 如果出现完completed_date就现实连接 -->
              <!-- 跳转链接 -->
              <el-link
                v-if="scope.row.fields.completed_date"
                type="success"
                @click="toResult(scope.row.fields.job_name)"
              >
                {{ scope.row.fields.proj_name }}
              </el-link>
              <!-- 否者现实弹框 -->
              <el-popover v-else trigger="click" placement="top">
                <p>
                  Job
                  <span style="color: red">{{
                    scope.row.fields.proj_name
                  }}</span>
                  is not completed
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-link type="info" disabled>
                    {{ scope.row.fields.proj_name }}
                  </el-link>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Tools">
            <template slot-scope="scope">
              {{ scope.row.fields.tools.replace(',', ', ') }}
            </template>
          </el-table-column>
          <el-table-column label="Submitted Date">
            <template slot-scope="scope">
              {{ format_date(scope.row.fields.upload_date) }}
            </template>
          </el-table-column>
          <el-table-column label="Started Date">
            <template slot-scope="scope">
              {{ format_date(scope.row.fields.running_date, 'pending') }}
            </template>
          </el-table-column>

          <el-table-column
            sortable
            prop="fields.completed_date"
            label="Completed Date"
          >
            <template slot-scope="scope">
              {{ format_date(scope.row.fields.completed_date, '-') }}
            </template>
          </el-table-column>
          <el-table-column sortable prop="fields.run_status" label="Status">
            <template slot-scope="scope">
              {{ scope.row.fields.run_status }}
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
  </div>
</template>

<script>
export default {
  name: 'Structure_queue',
  data() {
    return {
      tableData: [],
      currentPage: 1, //默认显示页面为1
      pagesize: 10, //    每页的数据条数
      searchType: 'job_name',
      searchContent: '',
      loading: false,
      tableKey: 'tableStruc',
    }
  },
  mounted() {
    this.queue()
  },

  computed: {},

  methods: {
    searchType_show() {
      return this.searchType === 'job_name' ? 'Job Name' : 'Email Address'
    },

    queryJob(searchType) {
      this.loading = true
      this.$http
        .get('protein/api/structure/search/', {
          params: {
            searchType: searchType,
          },
        })
        .then((res) => {
          this.tableKey = searchType
          this.tableData = JSON.parse(res.data)
          this.loading = false
        })
    },

    searchJob() {
      if (!this.searchContent) {
        this.$message.error({ message: 'Empty Input!', center: true })
        return
      }
      this.$http
        .get('/protein/api/structure/search/', {
          params: {
            searchType: this.searchType,
            searchContent: this.searchContent,
          },
        })
        .then((res) => {
          this.tableKey = this.searchType
          this.tableData = JSON.parse(res.data)
        })
    },

    clickRow({ row, rowIndex }) {
      console.log(row)
    },
    toResult(proj_name) {
      this.$router.push({
        path: '/predict/structure/result/',
        query: { proj_name: proj_name },
      })
    },
    queue() {
      this.loading = true
      this.$http.get('/protein/api/structure/queue/').then((response) => {
        this.tableData = JSON.parse(response.data)
        this.loading = false
        // console.log(this.tableData)
      })
    },
    format_date: function (dat_str, return_str) {
      if (dat_str) {
        return dat_str
          .toString()
          .replace('T', ' ')
          .replace(/\.\d+$/, '')
      } else {
        return return_str
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.fields.running_date && !row.fields.completed_date) {
        return 'warning-row'
      }
      return ''
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
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>