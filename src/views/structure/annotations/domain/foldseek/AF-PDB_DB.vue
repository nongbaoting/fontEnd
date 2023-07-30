<template>
  <div>
    <!-- <h1>Hello</h1> -->
    <el-row :gutter="20">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClickTab"
      >
        <el-tab-pane label="Table" name="table">
          <!-- 表格 -->

          <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="loading"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :key="tableKey"
            @sort-change="sortChange"
          >
            <!-- 列 -->
            <!-- <el-table-column type="index"></el-table-column> -->
            <el-table-column
              sortable="custom"
              prop="ecod_domain_id"
              :label="annoDBName"
            >
              <template slot-scope="scope">
                <!-- 如果出现完completed_date就现实连接 -->
                <!-- 跳转链接 -->
                <el-link
                  type="primary"
                  target="_blank"
                  :href="linkDB[annoDBName].link + scope.row.ecod_domain_id"
                >
                  {{ linkDB[annoDBName].name }}
                </el-link>

                <!-- 否者现实弹框 -->
              </template>
            </el-table-column>

            <el-table-column
              width="120"
              sortable="custom"
              prop="qstart"
              label="Query Start:end"
            >
              <template slot-scope="scope">
                <el-button
                  size="large"
                  class="cell-button"
                  type="success"
                  @click="clickDomain(scope.row)"
                >
                  {{ scope.row.qstart }}-{{ scope.row.qend }}</el-button
                >
              </template>
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
              :label="domainOrSuper[annoDBName]"
            >
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <el-button @click="alignDomin2Query(scope.row)" type="warning">
                  Align
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="40" justify="end">
            <!-- 分页 -->
            <!--分页条 -->
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
        </el-tab-pane>
        <el-tab-pane label="Alignment" name="alignment">
          <el-row>
            <protein-body-view
              @clickOnSegment="passEmit"
              v-if="tableData.length > 0"
              :dataset="tableData"
            ></protein-body-view>
          </el-row>
          <el-row justify="space-around">
            <!-- 分页 -->
            <!--分页条 -->

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
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import proteinBodyVue from './proteinBody.vue'

export default {
  components: {
    'protein-body-view': proteinBodyVue,
  },
  props: ['annoDBName', 'viewkey', 'protein_id', 'request_Data_url'],
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
      tableKey: this.viewkey,
      loading: true,
      // end table
      linkDB: {
        pdbDB: {
          link: 'https://www.rcsb.org/structure/',
          name: 'RCSB',
        },
        AFDB: {
          link: 'https://alphafold.ebi.ac.uk/entry/',
          name: 'AlphaFoldDB',
        },
      },
      domainOrSuper: {
        ECOD: 'Domain',
        SCOP: 'SuperFamily',
      },
      activeName: 'alignment',
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
            request_type: this.annoDBName,

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
    handleClickTab() {
      console.log(this.width)
    },
    toResult(row) {
      console.log(row)
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

    passEmit(e) {
      this.$emit('clickOnFoldseekMatch', e)
    },

    alignDomin2Query(row) {
      console.log(row)
      this.$http({
        url: 'protein/api/pdb_domain_annotations/align/',
        params: {
          uuid: this.$route.query.uuid,
          db_pdbid: row.target,
          db_name: this.annoDBName,
          chain: row.chain,
        },
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        let data = {
          url: url,
          chain: row.chain,
          start: row.start,
          end: row.end,
        }

        this.$emit('emitAlign', data)
        // this.pdbe(url)
      })
    },

    clickDomain(row) {
      //   console.log(row)
      //   console.log(column)
      let e = {
        chain: 'A',
        color: '#A65628',
        start: row.qstart,
        end: row.qend,
      }
      this.$emit('clickOnFoldseekMatch', e)
    },
    //每页下拉显示数据
    handleSizeChange: function (size) {
      this.pageSize = size
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

<style lang="less" scoped>
.cell-button {
  font-size: 18px;
  font-weight: bold;
}
</style>