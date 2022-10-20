<template>
  <div>

    <el-row v-for="(item,index) in tableData" :gutter="10">

      <el-col :offset="1" :span="5">
        <el-descriptions
          :column="2"
          size="large"
          labelClassName="desc_content"
          contentClassName="desc_content"
        >
          <el-descriptions-item label="ID" :span="2">{{
            item.target
          }}</el-descriptions-item>
          <el-descriptions-item label="Description">{{
            item.desc
          }}</el-descriptions-item>
       
        </el-descriptions>
      </el-col>
      <el-col :span="18">
        <gene-body
          :key="item.cdd_nameCat"
          :dataset="item.cdd_locs"
          :gene_length="item.target_len"
          :max="max_protein_length"
        >
        </gene-body>
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
  
    </el-row>
    </div>
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
import * as d3 from 'd3'
export default {
  components: {
    'gene-body': gene_body,
  },
  props: ['cdd_nameCat'],
  data() {
    return {
      tableData: [],
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      totalCount: 0, // 总数，返回得到
      max_protein_length: 0,
      isgenebody: false,
      field: 'target_len',
      order: 'ascending',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      console.log(this.cdd_nameCat)
      this.loading = true
      this.isgenebody = false

      this.filterForm['program'] = 'jackhmmer'

      this.filterForm['uuid'] = 'd4cbc25c-11da-490d-b059-2d3ff9554a0f'
      this.filterForm['cdd_nameCat'] = this.cdd_nameCat
      // // page
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      // // order
      this.filterForm['field'] = this.field
      this.filterForm['order'] = this.order
      this.filterForm['dataset'] = 'new'
      this.$http
        .post('/protein/api/blast/res/blast_jackhmmer/', this.filterForm, {
          timeout: 600 * 1000,
        })
        .then((response) => {
          //   console.log(response.data)
          this.tableData = response.data.data

          this.totalCount = response.data.totalCount
          this.max_protein_length = d3.max(this.tableData, function (d) {
            return d['target_len']
          })

          console.log(this.archiOpen)
          this.isgenebody = true
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