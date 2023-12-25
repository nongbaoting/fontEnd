<template>
  <div class="container_eachProtein"  v-loading="loading" element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">

    <el-row v-for="(item,index) in tableData" :gutter="0" class="eachProtein_row" >

      <el-col :key="item.target + 'desc'" :span="6">
          <el-row>
              <p>ID: <el-link 
              class="em_title"
               :href="'https://www.ncbi.nlm.nih.gov/protein/' + item.protin_id"
                target="_blank"
                type="success" >{{ item.protin_id}}</el-link>  </p>
          </el-row>
          <el-row >
              <p>{{item.desc}}</p>
          </el-row>
     
      </el-col>
      <el-col :span="18" >
        <gene-body
          :key="item.target + 'gene_body'"
          :dataset="item.cdd_locs"
          :gene_length="item.length"
          :max="max_protein_length"
          :show_len="true"
        >
        </gene-body>
      </el-col>
    </el-row>
      <el-row :gutter="40" justify="end" class="bar">
      <!--分页条 -->
      <!-- 分页 -->
      <el-col :offset="6" :span="12">
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
    min: 0,
    max: 300000,
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
  field: 'target_len',
  order: 'ascending',
}
import gene_body from './archi_genebody.vue'
import * as d3 from 'd3'
export default {
  components: {
    'gene-body': gene_body,
  },
  props: ['cdd_nameCat', 'dataset_main', 'q_id', 'program'],
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
      loading: true,
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

   

      this.filterForm['q_id'] = this.q_id
      this.filterForm['cdd_nameCat'] = this.cdd_nameCat
      // // page
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      // // order
      this.filterForm['field'] = this.field
      this.filterForm['order'] = this.order
      
      this.$http
        .post('protein/api/results/repeatDomain/fetchProteins/', this.filterForm, {
          timeout: 600 * 1000,
        })
        .then((response) => {
            console.log(response.data)
          // console.log(response.data.data)
          let data = response.data.data
          let newColor_data = new Array()
          //   console.log(data)
          for (let item of data) {
            let cdd_locs = item['cdd_locs']
            console.log(cdd_locs)
            let newColor_locs = new Array()
            for (let i = 0; i < cdd_locs.length; i++) {
              let domain = cdd_locs[i]
              let domain_main = this.dataset_main[i]
              // domain[4] = domain_main[4]
              newColor_locs.push(domain)
            }
            item['cdd_locs'] = newColor_locs
            newColor_data.push(item)
          }
          this.tableData = newColor_data
          //   this.tableData = response.data.data
          console.log(this.tableData)

          this.totalCount = response.data.totalCount
          this.max_protein_length = d3.max(this.tableData, function (d) {
            return d['length']
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

<style lang="less" scoped>
.container_eachProtein {
  background-color: #f1f1ef;
  padding: 0px;
  font-size: calc(8px + 1vmin);
}
.eachProtein_row {
  padding-top: 10px;
  border: 1px solid #fff;
}
.pagination {
  font-size: calc(16px + 1vmin);
  color: #e2e2a6;
}

.my-content {
  font-size: calc(11px + 1vmin);
}
.em_title {
  font-size: calc(9px + 1vmin);
}
</style>