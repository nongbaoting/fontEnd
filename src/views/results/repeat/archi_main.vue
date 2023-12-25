<template>
  <div class="container_archi_each">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-row :gutter="10">
          <el-col :span="2">
            <i
              style="height: 20px; width: 20px"
              :class="add_icon ? 'el-icon-folder-add' : 'el-icon-folder-remove'"
              v-on:click="
                show_proteins = !show_proteins
                add_icon = !add_icon
                open_archi(item.cdd_nameCat)
              "
            ></i>
          </el-col>
          <el-col :span="22">
            <p class="em_title">{{ item.commonDesc }}</p>
          </el-col>
        </el-row>
        <el-row
          >
            Total sequences:<span class="em_font"> {{ item.numProtein }} </span> 
            <span>Clusters: <span class="em_font">{{item.clusters_num}}</span></span>
         </el-row
        >
        <el-row
          ><span>
            Min Length:
            <span class="em_font"> {{ item.min_len }}</span></span
          ><span>
            Max Length:
            <span class="em_font"> {{ item.max_len }}</span></span
          ></el-row
        >
      </el-col>

      <el-col :span="18">
        <gene-body
          :key="item.cdd_nameCat"
          :dataset="item.cdd_locs"
          :gene_length="item.length"
          :max="max_protein_length"
        >
        </gene-body>
      </el-col>
    </el-row>
    <archi-each-protein
      :key="item.cdd_nameCat"
      :cdd_nameCat="item.cdd_nameCat"
      :dataset_main="item.cdd_locs"
      v-if="show_proteins"
      :q_id="item.q_id"
     
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
  props: ['item', 'max_protein_length', 'uuid', 'program'],
  data() {
    return {
      show_proteins: false,
      add_icon: true,
    }
  },
  methods: {
    open_archi(cdd_nameCat) {
      console.log('hello')
    },
  },
}
</script>

<style scoped lang="less" >
.container_archi_each {
  background-color: #eceecf;
  padding: 5px;
  margin: 0px;
  font-size: calc(6px + 1vmin);
}
.em_font {
  font-weight: bold;
}
.em_title {
  font-weight: bold;
  font-size: calc(11px + 1vmin);
}
.el-icon-folder-add,
.el-icon-folder-remove {
  background-color: yellow;
}
</style>