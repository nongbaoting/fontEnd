<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Alignment Score</h5>
        <el-menu
          :router="true"
          :default-active="activePath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="crispr/alginscore/spalgin">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalign</span>
          </el-menu-item>
          <el-menu-item index="crispr/alginscore/spalginNS">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">SPalignNS</span>
          </el-menu-item>
          <el-menu-item index="crispr/alginscore/TMalgin">
            <i class="el-icon-location"></i>
            <span class="headtext" slot="title">TMalgin</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18"><router-view></router-view></el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>