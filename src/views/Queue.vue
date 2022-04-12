<template>
  <div class="container">
    <el-row
      :gutter="20"
      class="searchPageBar"
      type="flex"
      justify="space-between"
    >
      <!-- 搜索框 -->
      <!-- <el-col :span="12">
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
      </el-col> -->
      <!-- 选择subset按钮 -->
      <!-- <el-col :span="12">
        <el-row :gutter="50" type="flex" justify="center">
          <el-button plain @click="queue(pageSize, currentPage)">All</el-button>
          <el-button type="primary" plain @click="subsetJob('running_date')"
            >Active</el-button
          >
          <el-button type="warning" plain @click="subsetJob('pending')"
            >Pending</el-button
          >
          <el-button type="success" plain @click="subsetJob('completed_date')"
            >Success</el-button
          >
        </el-row>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col>
        <!-- 表格 -->

        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @row-click="clickRow"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="tableKey"
        >
          <!-- 列 -->
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column sortable prop="job_name" label="Job name">
            <template slot-scope="scope">
              <!-- 如果出现完completed_date就现实连接 -->
              <!-- 跳转链接 -->
              <el-link
                v-if="scope.row.fields.completed_date"
                type="success"
                @click="
                  toResult(
                    scope.row.fields.uuid,
                    scope.row.fields.proj_type,
                    scope.row.fields.job_name,
                    scope.row.fields.run_status,
                    scope.row.fields.completed_date
                  )
                "
              >
                {{ scope.row.fields.job_name }}
              </el-link>
              <!-- 否者现实弹框 -->
              <el-popover v-else trigger="click" placement="top">
                <p>
                  Job
                  <span style="color: red">{{
                    scope.row.fields.job_name
                  }}</span>
                  is not completed
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-link type="info" disabled>
                    {{ scope.row.fields.job_name }}
                  </el-link>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Program">
            <template slot-scope="scope">
              {{ scope.row.fields.proj_type }}
            </template>
          </el-table-column>

          <el-table-column label="Tools">
            <template slot-scope="scope">
              {{ scope.row.fields.tools.replace(',', ', ') }}
            </template>
          </el-table-column>
          <el-table-column sortable prop="fields.task_status" label="Status">
            <template slot-scope="scope">
              {{ scope.row.fields.task_status }}
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
  </div>
</template>

<script>
const pathDt = {
  blast: '/sequence/blast/res/',
  'Phylogenetic Analysis': '/phylogenetic/plot/',
  'CD Search': '/sequence/blast/cdd_searchSave_result',
  'Structure Comparison': '/structure_similarity/results',
}
export default {
  name: 'Structure_queue',
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      searchType: 'job_name',
      searchContent: '',
      loading: false,
      tableKey: 'tableStruc',
    }
  },
  mounted() {
    this.queue(this.pageSize, this.currentPage)
  },

  computed: {},

  methods: {
    searchType_show() {
      // 显示下拉
      return this.searchType === 'job_name' ? 'Job Name' : 'Email Address'
    },

    subsetJob(searchType) {
      // subset
      this.loading = true
      this.$http
        .get('api/blast/queue/search/', {
          params: {
            searchType: searchType,
            searchContent: this.searchContent,
          },
        })
        .then((response) => {
          //   console.log(response)
          this.tableData = JSON.parse(response.data.data)
          this.totalCount = response.data.totalCount
          console.log(this.totalCount)
          this.loading = false
        })
    },

    searchJob() {
      if (!this.searchContent) {
        this.$message.error({ message: 'Empty Input!', center: true })
        return
      }
      this.$http
        .get('api/blast/queue/search/', {
          params: {
            searchType: this.searchType,
            searchContent: this.searchContent,
          },
        })
        .then((response) => {
          //   console.log(response)
          this.tableData = JSON.parse(response.data.data)
          this.totalCount = response.data.totalCount
        })
    },

    clickRow({ row, rowIndex }) {
      //   console.log(row)
    },
    toResult(uuid, proj_type, job_name, run_status, datetime) {
      let mypath = pathDt[proj_type]
      let routeData = this.$router.resolve({
        path: mypath,
        query: {
          uuid: uuid,
          job_name: job_name,
          run_status: run_status,
          program: proj_type,
          datetime: datetime,
        },
      })
      window.open(routeData.href, '_blank')
    },
    queue(pageSize, currentPage) {
      this.loading = true
      this.$http
        .get('api/Queue/', {
          params: {
            pageSize: pageSize,
            currentPage: currentPage,
          },
        })
        .then((response) => {
          //   console.log(response.data)
          this.tableData = JSON.parse(response.data.data)
          this.totalCount = response.data.totalCount
          this.loading = false

          console.log(this.tableData)
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
      this.pageSize = size
      this.currentPage = 1
      this.queue(this.pageSize, this.currentPage)
      /*console.log(this.pageSize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.queue(this.pageSize, this.currentPage)
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
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
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

.el-table,
.el-link {
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}
</style>

<style >
.pagination {
  padding-top: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>