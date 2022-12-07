<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-table
          :key="'tabTMalign' + currentPage + pageSize"
          :data="tableData"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @sort-change="sortChange"
        >
          <el-table-column label="Align" width="80">
            <template slot-scope="scope">
              <el-link
                type="success"
                @click="toAlignment(scope.row.chain1, scope.row.chain2_acc)"
                >align
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="Chain 1" prop="chain1" width="80">
            <template slot-scope="scope">
              <el-link
                :href="'https://www.rcsb.org/structure/' + scope.row.chain1"
                target="_blank"
                type="primary"
                style="font-size: 18px"
                >{{ scope.row.chain1 }}</el-link
              >
            </template>
          </el-table-column>

          <el-table-column label="Protein 2" prop="protein_name" width="300">
            <template slot-scope="scope">
              <el-link
                :href="
                  'https://www.uniprot.org/uniprotkb/' +
                  scope.row.chain2_acc +
                  '/entry'
                "
                target="_blank"
                type="primary"
                style="font-size: 18px"
                >{{ scope.row.protein_name }}</el-link
              >
            </template>
          </el-table-column>

          <el-table-column label="Genome" prop="genome_genbank" width="120">
            <template slot-scope="scope">
              <el-link
                :href="
                  'https://www.ncbi.nlm.nih.gov/nuccore/' +
                  scope.row.genome_genbank +
                  '/entry'
                "
                target="_blank"
                type="primary"
                style="font-size: 18px"
                >{{ scope.row.genome_genbank }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            label="NCBI ID"
            prop="protein_genebankID"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="Organism "
            prop="organism"
            width="300"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Length 1"
            prop="chain1_len"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Length 2"
            prop="chain2_len"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Cov 1"
            prop="cov1"
          ></el-table-column>

          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Cov 2"
            prop="cov2"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="alignScore"
            prop="alignScore"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Similarity"
            prop="similar"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="TMScore"
            prop="tmScore"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="RMSD"
            prop="RMSD"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            label="Identity"
            prop="seq_ID"
          ></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>
                <div :key="'ex' + props.row.repeatinfo"></div>
                <el-form
                  label-position="center"
                  inline
                  class="demo-table-expand"
                  v-for="item in props.row.repeatinfo"
                >
                  <el-form-item label="Repeat">
                    <span>{{ item[3] }}</span>
                  </el-form-item>
                  <el-form-item label="Repeat position">
                    <span>{{ item[1] }} .. {{ item[2] }}</span>
                  </el-form-item>
                  <el-form-item label="Anti-repeat">
                    <span>{{ item[6] }}</span>
                  </el-form-item>
                  <el-form-item label="Anti-repeat position">
                    <span>{{ item[4] }} .. {{ item[5] }}</span>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
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
    }
  },

  mounted() {
    this.getData(this.pageSize, 1)
  },

  watch: {
    isfilter: function () {
      console.log('filters')
      this.getData(this.pageSize, 1)
    },
  },

  methods: {
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
      this.loading = true
      console.log(this.$route.path)
      this.$http
        .get('crispr/api/structure/cas12f1/FatcatScore/', {
          params: {
            pageSize: pageSize,
            currentPage: currentPage,
            field: this.field,
            order: this.order,
            tool: this.tool,
            filters: this.filters,
          },
        })
        .then((response) => {
          console.log(response.data)
          let data = response.data.data
          this.tableData = data
          console.log(data)
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