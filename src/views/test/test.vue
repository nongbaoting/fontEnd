<template>
    <div>
      <el-row>
        <el-tabs v-model="activeName" type="border-card" tabPosition="left">
          <el-tab-pane label="domainPdbe" name="domainPdbe">
            <domainpdbe-view v-if="activeName == 'domainPdbe'"></domainpdbe-view>
          </el-tab-pane>
  
        
        </el-tabs>
      </el-row>
    </div>
  </template>
  
  <script>
  import domainPdbe from './domain_pdbe.vue'
 
  export default {
    data() {
      return {
        activeName: 'domainPdbe',
      }
    },
    components: {
      'domainpdbe-view': domainPdbe,
     
    },
  }
  </script>
  
  <style>
  </style>