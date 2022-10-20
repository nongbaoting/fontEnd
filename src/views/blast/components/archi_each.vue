<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="1">
        <i
          class="el-icon-folder-add"
          v-on:click="
            show_proteins = !show_proteins
            open_archi(item.cdd_nameCat)
          "
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
          :key="item.cdd_nameCat"
          :dataset="item.cdd_locs"
          :gene_length="item.target_len"
          :max="max_protein_length"
        >
        </gene-body>
      </el-col>
    </el-row>
    <archi-each-protein
      :cdd_nameCat="item.cdd_nameCat"
      v-if="show_proteins"
    ></archi-each-protein>
  </div>
</template>

<script>
import gene_body from './archi_genebody.vue'
import archi_eachProtein from './archi_eachProtein.vue'
import * as d3 from 'd3'
export default {
  components: {
    'gene-body': gene_body,
    'archi-each-protein': archi_eachProtein,
  },
  props: ['item', 'max_protein_length'],
  data() {
    return {
      show_proteins: false,
    }
  },
  methods: {
    open_archi(cdd_nameCat) {
      console.log('hello')
    },
  },
}
</script>

<style>
</style>