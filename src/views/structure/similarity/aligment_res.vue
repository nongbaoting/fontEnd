<template>
  <div>
    <el-row>
      <el-tabs v-model="activeName" type="border-card" tabPosition="left">
        <el-tab-pane label="TMalign" name="TMalign">
          <tmalign-view v-if="activeName == 'TMalign'"></tmalign-view>
        </el-tab-pane>

        <el-tab-pane label="SPalign" name="SPalign">
          <spalign-view v-if="activeName == 'SPalign'"></spalign-view>
        </el-tab-pane>

        <el-tab-pane label="FATCAT" name="FATCAT">FATCAT </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import TMalign from './alignment/TMalign.vue'
import SPalign from './alignment/SPalign.vue'
export default {
  data() {
    return {
      activeName: 'SPalign',
    }
  },
  components: {
    'tmalign-view': TMalign,
    'spalign-view': SPalign,
  },
}
</script>

<style>
</style>