<template>
  <div class="container">
    <el-row>
      <el-table
        :key="'tabCrispr' + currentPage + pageSize"
        ref="tabCrispr"
        :data="tableData"
        v-loading="loading"
        element-loading-text="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="Accession" prop="accession"></el-table-column>
        <el-table-column label="CAS" prop="cas_class"></el-table-column>
        <el-table-column
          label="Data Class"
          prop="/prdata_class"
        ></el-table-column>

        <el-table-column label="Entry name" prop="entry_name"></el-table-column>
        <el-table-column label="Gene Name" prop="gene_name"></el-table-column>
        <el-table-column
          label="Organism"
          prop="organism"
          width="320"
        ></el-table-column>
        <el-table-column
          label="Protein Name"
          prop="protein_name"
        ></el-table-column>

        <el-table-column
          label="Length"
          prop="sequence_length"
        ></el-table-column>
        <el-table-column label="Structure">
          <template slot-scope="scope">
            <!-- 如果出现完completed_date就现实连接 -->
            <!-- 跳转链接 -->
            <el-link
              v-if="scope.row.pdb"
              type="success"
              @click="toMolstar(scope.row.accession)"
              >PDB</el-link
            >
            <el-popover v-else trigger="click" placement="top">
              <p>
                Structure prediction of
                <span style="color: red">{{ scope.row.accession }}</span>
                is not completed
              </p>
              <div slot="reference" class="name-wrapper">
                <el-link type="info" disabled> pdb </el-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, //默认显示页面为1
      pageSize: 10, //    每页的数据条数
      loading: false,
      totalCount: 0,
    }
  },
  mounted() {
    this.getData(10, 1)
  },
  methods: {
    toMolstar(accession) {
      let routeData = this.$router.resolve({
        path: '/crispr/molstar/',
        query: {
          filename: accession,
        },
      })
      window.open(routeData.href, '_blank')
    },
    getData(pageSize, currentPage) {
      this.loading = true
      this.$http
        .get('crispr/api/browse', {
          params: {
            pageSize: pageSize,
            currentPage: currentPage,
            // order: order,
            // columnName: columnName,
          },
        })
        .then((response) => {
          console.log(response.data)
          this.tableData = response.data.data
          this.totalCount = response.data.totalCount
          console.log(this.tableData)
          this.loading = false
        })
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