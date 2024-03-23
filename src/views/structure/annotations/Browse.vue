<template>
  <div>
    <el-row :gutter="20" style="margin-top:20px;margin-bottom:20px" justify="space-around">
      <el-col :offset="2" :span="10">
        
        <el-input
          :placeholder="'Search by your ' + searchType_show()"
          v-model="searchContent"
          class="input-with-select"
          @keyup.enter.native="searchJob"
          style="text-transform: uppercase"
        >
          <el-select v-model="searchType" slot="prepend" placeholder="Gene Name">
            <el-option label="Gene Name" value="gene_names"></el-option>
            <el-option label="Protein Name" value="protein_names"></el-option>
          </el-select>
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="getData(10,1)"
          >Search</el-button>
        </el-input>
     
      </el-col>

    </el-row>
    <el-row :gutter="20">
      <el-col :offset="2" :span="20">
        <el-table
          :key="'tabTMalign' + currentPage + pageSize"
          :data="tableData"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @sort-change="sortChange"
        >
          <el-table-column label="Accession" prop="fields.uniprot"  width="200">
            <template slot-scope="scope">
              <el-link
                :href="'https://www.rcsb.org/structure/' + scope.row.chain1"
                target="_blank"
                type="primary"
                style="font-size: 18px"
                >{{ scope.row.fields.uniprot }}</el-link
              >
            </template>
          </el-table-column>
     
          <el-table-column
            label="Protein Names"
            prop="fields.protein_names"
         
          ></el-table-column>
            <el-table-column
            label="Gene Names"
            prop="fields.gene_names"
           
          ></el-table-column>
            <el-table-column
            label="Organism"
            prop="fields.organism"
           
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
      searchType: 'gene_names',
      searchContent: ''
    }
  },

  mounted() {
    this.getData(this.pageSize, 1)
    this.searchType_show()
  },

  watch: {
    isfilter: function () {
      console.log('filters')
      this.getData(this.pageSize, 1)
    },
  },

  methods: {

     searchType_show() {
      return this.searchType === 'protein_names' ? 'Protein Name' : 'Gene Name'
    },

    toAlignment(input_id, target_id) {
      let routeData = this.$router.resolve({
        path: '/crispr/alginScore/alignment',
        query: {
          input_id: input_id,
          target_id: target_id,
        },
      })
      window.open(routeData.href, '_blank')
    },

    getData(pageSize, currentPage) {
      this.pageSize=pageSize
      this.currentPage=currentPage
      this.loading = true
      console.log(this.$route.path)
      this.$http
        .get('protein/api/pdb_domain_annotations/browse/', {
          params: {
            searchType: this.searchType,
            searchContent: this.searchContent,
            pageSize: pageSize,
            currentPage: currentPage,
            field: this.field,
            order: this.order,
            request_type: 'search'
          },
        })
        .then((response) => {
          console.log(response)
          let data = JSON.parse(response.data.data)
          this.tableData = data
          console.log(data)
          this.totalCount = response.data.totalCount
          this.loading = false
        })
    },

    // searchData() {
    //   this.loading = true
    //   console.log(this.$route.path)
    //   this.$http
    //     .get('protein/api/pdb_domain_annotations/browse/', {
    //       params: {
    //         searchType: this.searchType,
    //         searchContent: this.searchContent,
    //         pageSize: this.pageSize,
    //         currentPage: 1,
    //         field: this.field,
    //         order: this.order,
    //         request_type: 'search'
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response)
    //       let data = JSON.parse(response.data.data)
    //       this.tableData = data
    //       console.log(data)
    //       this.totalCount = response.data.totalCount
    //       this.loading = false
    //     })
    // },

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