<template>
  <div class="container">
    <el-row class="myrow" :gutter="20">
      <el-col :span="6">
        Project Name:
        <span class="em_font">{{ this.$route.query.job_name }}</span>
      </el-col>
      <el-col :span="4">
        Program:
        <span class="em_font">{{ this.$route.query.program }}</span>
      </el-col>
      <el-col :span="4"
        >Total Architechures:
        <span class="em_font">{{ totalCount }}</span></el-col
      >
      <el-col :span="4"
        >Total Sequences:
        <span class="em_font">{{ totalSequence }}</span></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="16">
        <filter-from-archi
          @filter_result="getData()"
          :filterForm="filterForm"
          :refName="'filterForm'"
        ></filter-from-archi>
      </el-col>
    </el-row>
    <el-row :gutter="40" justify="end">
      <!--分页条 -->
      <!-- 分页 -->
      <el-col :span="12">
        <div>
          <el-pagination
            class="pagination"
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
      <el-col :span="12" class="button_content">
        <el-button type="success" @click="sortChange('count')"
          >Sort by Sequences Number</el-button
        >
        <el-button type="primary" @click="sortChange('target_len')"
          >Sort by Sequences Length</el-button
        >
      </el-col>
    </el-row>

    <!-- archi clusters -->
    <div
      :id="'archi' + index"
      v-for="(item, index) in tableData"
      class="archi_row"
    >
      <archi-each
        :key="'archi_each' + currentPage + pageSize + index"
        :item="item"
        :index="index"
        :max_protein_length="max_protein_length"
        :uuid="uuid"
        :program="program"
        :show_len="false"
      ></archi-each>
    </div>
    <!--分页条 -->
    <el-row :gutter="40" justify="end">
      <!-- 分页 -->
      <el-col>
        <div>
          <el-pagination
            class="pagination"
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
  </div>
</template>

<script>
const filterForm_ori = {
  target_len: {
    min: 400,
    max: 3000,
  },
  ident: {
    min: 0,
    max: 100,
  },

  domains: [
    {
      type: 'cdd_nameCat',
      value: '',
      count: 1,
      exclude: false,
    },
    {
      type: 'cdd_nameCat',
      value: '',
      count: 1,
      exclude: false,
    },
  ],
  anno_source: 'all',

  uuid: '',
  program: '',
  // page
  currentPage: 1,
  pageSize: 10,
  // order
  field: 'cdd_nameCat',
  order: 'descending',
}
import gene_body from './archi_genebody.vue'
import FilterFormArchi from './archi_filterForm.vue'
import archi_each from './archi_each.vue'
import * as d3 from 'd3'
export default {
  components: {
    'archi-each': archi_each,
    'filter-from-archi': FilterFormArchi,
  },
  data() {
    return {
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
      tableData: [],
      totalSequence: 0,
      seqWithAnnotate: 0,
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      totalCount: 0, // 总数，返回得到
      max_protein_length: 0,
      isgenebody: false,
      field: 'count',
      order: 'descending',
      order_toggle: false,
      program: this.$route.query.program,
      uuid: this.$route.query.uuid,
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    tableData: function (newTableData, oldTableData) {
      //   this.pageAllprotin_id = newTableData.map((item) => item['target'])
      // this.setColor()
      //   this.pageHasSelected()
      this.max_protein_length = d3.max(newTableData, function (d) {
        return d['target_len']
      })
    },
  },

  methods: {
    getData() {
      this.loading = true
      this.isgenebody = false
      this.filterForm['program'] = this.$route.query.program
      this.filterForm['uuid'] = this.$route.query.uuid

      // // page
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      // // order
      this.filterForm['field'] = this.field
      this.filterForm['order'] = this.order
      this.filterForm['dataset'] = ''
      this.$http
        .post('protein/api/blast/res/architecture/', this.filterForm)
        .then((response) => {
          //   console.log(response.data)
          this.tableData = response.data.data

          this.totalCount = response.data.totalCount
          this.totalSequence = response.data.totalSequence
          this.seqWithAnnotate = response.data.seqWithAnnotate
          this.max_protein_length = d3.max(this.tableData, function (d) {
            return d['target_len']
          })

          console.log(this.tableData)
          this.isgenebody = true
          this.loading = false
        })
    },

    // sortchange
    sortChange: function (field) {
      this.loading = true
      this.order_toggle = !this.order_toggle
      this.order = this.order_toggle ? 'ascending' : 'descending'
      this.field = field
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

<style lang="less" scoped>
.container {
  padding: 20px;
  font-size: calc(11px + 1vmin);
}
.myrow {
  padding: 10px 0px;
}
.pagination {
  font-size: calc(16px + 1vmin);
}
.archi_row {
  margin-top: 10px;
  padding-left: 5px;

  border-top: 1px solid;
  background-color: #eceecf;
}

.button_content .el-button {
  font-size: calc(8px + 1vmin);
}
</style>

<style >
.em_font {
  font-weight: bold;
  font-size: calc(11px + 1vmin);
}
</style>