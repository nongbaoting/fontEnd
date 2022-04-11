<template>
  <div>
    <el-dialog
      :key="mykey"
      :title="'Range of ' + title"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      width="30%"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="Min">
          <el-input
            type="number"
            min="0"
            max="100"
            v-model="range.min"
            :placeholder="range.min"
          ></el-input>
        </el-form-item>
        <el-form-item label="Max">
          <el-input
            type="number"
            min="0"
            max="100"
            v-model="range.max"
            :placeholder="range.max"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeDialog">Cancer</el-button> -->
        <el-button type="primary" @click="closeDialog">confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['range', 'dialogVisible', 'mykey', 'sonClose', 'title'],
  data() {
    return {}
  },
  methods: {
    closeDialog() {
      this.$emit('sunClose')
    },
  },
}
</script>

<style>
</style>