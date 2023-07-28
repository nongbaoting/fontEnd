<template>
    <div>
      <el-row>
        <el-tabs v-model="activeName" type="border-card" tabPosition="left">
          <el-tab-pane label="domainPdbe" name="domainPdbe">
            <domainpdbe-view v-if="activeName == 'domainPdbe'"></domainpdbe-view>
          </el-tab-pane>
   <el-tab-pane label="molstar_view" name="molstar_view">
            <molstar-view v-if="activeName == 'molstar_view'"></molstar-view>
          </el-tab-pane>
        
        </el-tabs>
      </el-row>
    </div>
  </template>
  
  <script>
  import domainPdbe from './domain_pdbe.vue'
  import molstar_view from "./Molstar.vue"
 
  export default {
    data() {
      return {
        activeName: 'molstar_view',
      }
    },
    components: {
      'domainpdbe-view': domainPdbe,
      'molstar-view': molstar_view,
    },
  }
  </script>
  
  <style>
  </style>