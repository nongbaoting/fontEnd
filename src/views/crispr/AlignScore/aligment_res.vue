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

        <el-tab-pane label="FATCAT" name="FATCAT">
          <fatcat-view v-if="activeName == 'FATCAT'"></fatcat-view>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import TMalign from '../alignment/TMalign.vue'
import SPalign from '../alignment/SPalign.vue'
import Fatcat from '../alignment/Fatcat.vue'
export default {
  data() {
    return {
      activeName: 'FATCAT',
    }
  },
  components: {
    'tmalign-view': TMalign,
    'spalign-view': SPalign,
    'fatcat-view': Fatcat,
  },
}
</script>

<style>
</style>