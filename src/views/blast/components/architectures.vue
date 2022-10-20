<template>
  <div class="container">
    <p style="padding: 20px">Total Architechures: {{ totalCount }}</p>
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
      <el-col :span="12">
        <el-button type="success" class="button_content"
          >Sort by Sequences Number</el-button
        >
        <el-button type="primary" class="button_content"
          >Sort by Sequences Length</el-button
        >
      </el-col>
    </el-row>

    <div
      :id="'archi' + index"
      v-for="(item, index) in tableData"
      class="archi_row"
    >
      <!-- <el-row :gutter="10">
        <el-col :span="1">
          <i
            class="el-icon-folder-add"
            v-on:click="open_archi(item.cdd_nameCat, index)"
          ></i>
        </el-col>
        <el-col :span="5">
          <el-descriptions
            :title="item.commonDesc"
            :column="2"
            size="large"
            labelClassName="desc_content"
            contentClassName="desc_content"
          >
            <el-descriptions-item label="Total sequences" :span="2">{{
              item.count
            }}</el-descriptions-item>
            <el-descriptions-item label="Min Length">{{
              item.min_tlen
            }}</el-descriptions-item>
            <el-descriptions-item label="Max Length">{{
              item.max_tlen
            }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="18">
          <gene-body
            :key="
              'gene_body_currentPage' +
              currentPage +
              'pageSize' +
              pageSize +
              item.cdd_nameCat
            "
            :dataset="item.cdd_locs"
            :gene_length="item.target_len"
            :max="max_protein_length"
          >
          </gene-body>
        </el-col>
      </el-row> -->
      <archi-each
        :key="'archi_each' + index"
        :item="item"
        :index="index"
        :max_protein_length="max_protein_length"
      ></archi-each>
    </div>
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
import gene_body from './archi_genebody.vue'
import archi_each from './archi_each.vue'
import * as d3 from 'd3'
export default {
  components: {
    'archi-each': archi_each,
  },
  data() {
    return {
      tableData: [],

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
      this.$http
        .get('protein/api/blast/res/architecture/', {
          params: {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            program: 'jackhmmer',
            uuid: 'd4cbc25c-11da-490d-b059-2d3ff9554a0f',
            field: this.field,
            order: this.order,
          },
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
.container {
  padding: 20px;
}
.desc_content {
  font-weight: bold;
  font-family: sans-serif;
  font-size: calc(9px + 1vmin);
}
.button_content,
.pagination {
  font-weight: bold;
  font-family: sans-serif;
  font-size: calc(11px + 1vmin);
}
.el-descriptions {
  font-weight: bold;
  font-family: sans-serif;
  font-size: calc(16px + 1vmin);
}
.archi_row {
  padding-top: 20px;
  padding-left: 5px;
  border: 1px solid;
}
</style>