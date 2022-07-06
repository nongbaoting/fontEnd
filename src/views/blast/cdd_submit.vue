<template>
  <div class="container">
    <!-- 搜索框 -->
    <el-row :gutter="20" style="height: 400px">
      <el-col :span="18" :offset="3">
        <el-card class="box-card">
          <el-form ref="filterForm_cdd" :model="filterForm">
            <!-- TODO input title -->
            <el-row :gutter="5" class="align_text_center"
              ><el-col :span="4"><span>Key word type</span></el-col
              ><el-col :span="8">Key word</el-col>
              <el-col :span="6">Count</el-col>
              <el-col :span="4">
                <el-button icon="el-icon-plus" @click.prevent="addDomain()"
                  >Add Keyword</el-button
                >
              </el-col>
            </el-row>
            <el-form-item
              v-for="(domain, index) in filterForm.domains"
              :key="'cdd_domains.' + index + '.value'"
              :prop="'domains.' + index + '.value'"
            >
              <el-row :gutter="5">
                <el-col :span="18">
                  <el-input
                    :placeholder="'Search by CDD Keyword'"
                    v-model="domain.value"
                    prop="searchContent"
                  >
                    <el-select v-model="domain.type" slot="prepend"
                      ><el-option label="CDD Name" value="cdd_name"></el-option>
                      <el-option
                        label="CD Description"
                        value="cdd_desc_short"
                      ></el-option>
                    </el-select>

                    <el-input-number
                      controls-position="right"
                      :min="1"
                      slot="append"
                      prop="domain.count"
                      v-model="domain.count"
                    ></el-input-number>
                  </el-input>
                </el-col>

                <el-col :span="2.5">
                  <el-checkbox
                    border
                    prop="domain.exclude"
                    v-model="domain.exclude"
                    >Exclude</el-checkbox
                  >
                </el-col>

                <el-col :span="2.5" v-if="index > 0"
                  ><el-button @click.prevent="removeDomain(domain)"
                    >Delete</el-button
                  ></el-col
                >
              </el-row>
            </el-form-item>
            <el-form-item label="Protein Length" label-width="140px">
              <el-row :gutter="0">
                <!-- Target Length  -->
                <!-- TODO  traget lenth-->
                <el-col :span="16">
                  <el-col :span="10"
                    ><el-input
                      v-model="filterForm.target_len.min"
                      type="number"
                    >
                      <el-button slot="prepend">Min:</el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="1" class="inline" style="padding-left: 10px"
                    ><span>-</span></el-col
                  >
                  <el-col :span="10"
                    ><el-input
                      type="number"
                      v-model="filterForm.target_len.max"
                    >
                      <el-button slot="prepend">Max:</el-button>
                    </el-input></el-col
                  ></el-col
                >
              </el-row>
            </el-form-item>
            <el-form-item
              label-width="140px"
              label="CD Source:"
              props="filterForm.anno_source"
            >
              <el-select v-model="filterForm.anno_source" style="width: 400px">
                <el-option label="ALL (58235 PSSMs)" value="all"></el-option>
                <el-option
                  label="NCBI_Curated (17937 PSSMs)"
                  value="ncbi"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-col :span="4"
                ><el-button type="primary" @click="Submit()"
                  >Search CDD</el-button
                ></el-col
              >
              <el-col :span="4">
                <el-button @click="resetForm('filterForm_cdd')"
                  >Reset</el-button
                ></el-col
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <div>
      <!-- select + 分页条  -->
      <el-row
        :gutter="40"
        type="flex"
        justify="space-between"
        style="padding-top: 20px"
      >
        <!--分页条 -->
        <!-- 分页 -->
        <el-col :span="12" :offset="1" style="align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next,jumper"
            :total="totalCount"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
        </el-col>
        <!-- 提交phylo -->
        <el-col :span="10" class="weak_text">
          <el-row>
            <el-col :span="6">
              <span
                ><span style="color: salmon"> {{ select_num }} </span> sequence
                selected</span
              >
            </el-col>
            <el-col :span="18">
              <download-fasta :seqIDs="totalSelect"></download-fasta>
              <run-phylotree
                title="Choose a Job Name"
                mykey="phylotree"
                :seqIDs="totalSelect"
              >
              </run-phylotree>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-row>
        <el-col style="padding: 5px 10px">
          <!-- TODO 表格 -->
          <el-table
            ref="multipleTable"
            :key="'table' + currentPage + pageSize + order"
            v-show="showTable"
            :data="tableData"
            :stripe="true"
            tooltip-effect="blue"
            v-loading="loading"
            element-loading-text="loading data"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            @sort-change="sortChange"
            @select="userSelect"
            @select-all="userSelect"
            :cell-style="changeCellStyle"
            row-key="itemID"
          >
            <!--  选择 -->
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="65"
            >
            </el-table-column>
            <!-- Protein ID -->
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
            <el-table-column prop="protin_id" label="ID">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  target="_blank"
                  :href="
                    'https://www.ncbi.nlm.nih.gov/protein/' +
                    scope.row.protin_id
                  "
                >
                  {{ scope.row.protin_id }}
                </el-link>
              </template>
            </el-table-column>
            <!-- protein length -->
            <el-table-column
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
              prop="length"
              label="Protein Length (aa)"
            >
            </el-table-column>
            <!-- CDD -->
            <el-table-column
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
              prop="cdd_names"
              label="Conserved Domains"
              width="1200"
              style="width: 800px"
            >
              <template slot-scope="scope">
                <gene-body
                  :key="
                    'gene_body_currentPage' +
                    currentPage +
                    'pageSize' +
                    pageSize +
                    order
                  "
                  :dataset="scope.row.cdd_locs"
                  :gene_length="scope.row.length"
                  :max="max_protein_length"
                  v-if="isgenebody"
                ></gene-body>
                <!-- <el-row>
                  <el-popover
                    trigger="hover"
                    placement="top"
                    width="600"
                    :key="item.cdd + index"
                    v-for="(item, index) in parse_cdd(
                      scope.row.cdd_names,
                      scope.row.cdd_notes
                    )"
                  >
                    <p>
                      Description:
                      {{ item.note }}
                    </p>
                    <el-button
                      slot="reference"
                      class="no_space_button"
                      :style="'background-color:' + item.cdd_color"
                      >{{ item.cdd }}</el-button
                    >
                  </el-popover>
                </el-row> -->
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!--分页条 -->
      <el-row :gutter="40" justify="end">
        <!-- 分页 -->
        <el-col :offset="2">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next,jumper"
            :total="totalCount"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
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

  domains: [
    {
      type: 'cdd_name',
      value: 'cas7',
      count: 1,
      exclude: false,
    },
    {
      type: 'cdd_name',
      value: '',
      count: 1,
      exclude: false,
    },
  ],
  anno_source: 'all',
  currentPage: 1,
  pageSize: 10,
  uuid: '',
  field: 'length',
  order: 'descending',
  max_protein_lenth: '0',
}
import phylotreedialog from './components/run_phylogenetic.vue'
import download_fasta from './components/download_fasta.vue'
import gene_body from './components/gene_body.vue'
import * as d3 from 'd3'
export default {
  components: {
    'run-phylotree': phylotreedialog,
    'download-fasta': download_fasta,
    'gene-body': gene_body,
  },
  data() {
    return {
      filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
      showTable: true,
      tableData: [],
      loading: false,
      tableKey: 'tableStruc',
      // 页码 // order
      currentPage: 1,
      pageSize: 10,
      totalCount: 0, // 总数，返回得到
      field: 'length',
      order: 'descending',
      uuid: '',
      colors: {},
      multipleTable: [],
      totalSelect: [],
      pageAllprotin_id: [],
      select_num: 0,
      phylo_job_name: 'my_phylo_job_name',
      isgenebody: false,
      max_protein_length: 0,
    }
  },
  watch: {
    tableData: function (newTableData, oldTableData) {
      this.pageAllprotin_id = newTableData.map((item) => item['protin_id'])
      this.max_protein_length = d3.max(newTableData, function (d) {
        return d['length']
      })

      this.setColor()
      this.pageHasSelected()
    },
  },
  methods: {
    userSelect(val) {
      let pageSelect = val.map((item) => item['protin_id'])
      let pageNotSelct = this.pageAllprotin_id.filter(
        (item) => pageSelect.indexOf(item) === -1
      )

      this.totalSelect = this.pageAllprotin_id.concat(this.totalSelect)

      this.totalSelect = this.totalSelect
        .filter(this.GLOBAL.myUnique)
        .filter((item) => pageNotSelct.indexOf(item) === -1)

      console.log(this.totalSelect)

      this.select_num = this.totalSelect.length
    },

    pageHasSelected() {
      this.tableData.forEach((value) => {
        if (this.totalSelect.indexOf(value['protin_id']) != -1) {
          this.$refs.multipleTable.toggleRowSelection(value, true)
        }
      })
    },

    showSelectNum(val) {
      if (val == 'all') {
        this.getAllID()
      } else if (val == 'clear') {
        this.totalSelect = []
        this.$refs.multipleTable.clearSelection()
        this.select_num = 0
      } else {
        this.select_num = this.totalSelect.length
      }
    },

    getAllID() {
      this.totalSelect = []
      this.$http
        .get('/protein/api/cdd/search/get_all_protin_ids/', {
          params: { uuid: this.uuid },
        })
        .then((response) => {
          let data = JSON.parse(response.data)
          this.totalSelect = data.protin_ids
          this.select_num = this.totalSelect.length
          this.pageHasSelected()
        })
    },
    DownloadFasta() {},
    Run_phylogenetic() {
      this.$http
        .post('/protein/api/phylo/run/', {
          seqIDs: this.totalSelect,
          job_name: this.phylo_job_name,
        })
        .then((response) => {})
    },

    //提交
    Submit() {
      console.log(this.filterForm)
      this.showTable = true
      this.loading = true
      this.isgenebody = false
      this.$http
        .post('/protein/api/cdd/search/', this.filterForm)
        .then((response) => {
          console.log(response.data.status)
          // console.log(response.data.data)
          // this.tableData = JSON.parse(response.data.data)
          this.tableData = response.data.data
          this.currentPage = 1
          this.totalCount = response.data.totalCount
          console.log(this.tableData)
          this.uuid = response.data.uuid
          this.filterForm.uuid = response.data.uuid
          this.isgenebody = true
          this.loading = false
        })
    },

    removeDomain(item) {
      var index = this.filterForm.domains.indexOf(item)
      if (index > 0) {
        this.filterForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.filterForm.domains.push({
        type: 'cdd_name',
        value: '',
        count: 1,
        exclude: false,
        // key: Date.now(),
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // set color
    setColor() {
      let cdd_names = new Array()
      this.tableData.forEach((item) => {
        // let region_arr = item.cdd_names.split(', ')
        let region_arr = item.cdd_names
        cdd_names = cdd_names.concat(region_arr)
      })
      let uniqCdd = cdd_names.filter(this.GLOBAL.myUnique)
      for (let i = 0; i < uniqCdd.length; i++) {
        this.colors[uniqCdd[i]] = this.GLOBAL.colorSet[i]
      }
    },
    parse_cdd(region_cdd, note_cdd) {
      const spMatch = /, /
      // let region_arr = region_cdd.split(', ')
      // let note_arr = note_cdd.split('^^')
      let region_arr = region_cdd
      let note_arr = note_cdd
      console.log(region_arr)
      // let cols = randomColor(region_arr)
      // console.log(cols)
      let region_dt = new Array()
      for (let i = 0; i < region_arr.length; i++) {
        region_dt.push({
          cdd: region_arr[i],
          cdd_color: this.colors[region_arr[i]],
          note: note_arr[i],
        })
      }
      return region_dt
    },

    changeCellStyle(row, column, rowIndex, columnIndex) {
      // console.log(row.column.label)
      if (row.column.label === 'CDD') {
        return {
          padding: '5px 0',
          margin: '0px',
          // 'background-color': 'salmon',
          'line-height': '26px',
        } // 修改的样式
      } else {
        return ''
      }
    },
    // sortchange
    sortChange: function (column) {
      console.log(column.column + '-' + column.prop + '-' + column.order)

      this.order = column.order
      this.field = column.prop
      this.currentPage = 1
      this.pages()
    },

    pages() {
      this.isgenebody = false
      this.$http
        .get('/protein/api/cdd/search/page/', {
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            uuid: this.uuid,
            order: this.order,
            field: this.field,
            anno_source: this.filterForm.anno_source,
          },
        })
        .then((response) => {
          this.tableData = response.data.data
          this.totalCount = response.data.totalCount
          console.log(this.tableData)
          this.uuid = response.data.uuid
          this.isgenebody = true
          this.loading = false
        })
    },
    //每页下拉显示数据
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.pages()
      /*console.log(this.pageSize) */
    },
    //点击第几页
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.pages()
      /*console.log(this.currentPage) */
    },
  },
}
</script>

<style >
.center {
  text-align: center;
}
.el-pagination {
  font-size: 16px;
}
.el-select {
  width: 140px;
}
</style>