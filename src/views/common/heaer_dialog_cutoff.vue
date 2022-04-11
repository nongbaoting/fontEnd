<template>
  <div>
    <el-dialog
      :key="mykey"
      :title="'Cutoff of ' + title"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      width="30%"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="cutoff">
          <el-input v-model="cutoff.cutoff" :placeholder="cutoff"></el-input>
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
  props: ['cutoff', 'dialogVisible', 'mykey', 'sonClose', 'title'],
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