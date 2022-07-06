<template>
  <div>
    <el-button :disabled="seqIDs.length < 3" @click="dialogVisible = true">
      Run Phylogenetic
    </el-button>

    <el-dialog
      :key="mykey"
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="cancel"
    >
      <el-form>
        <el-form-item label="Job name">
          <el-input v-model="ruleForm.job_name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="ruleForm.email"
            type="email"
            auto-complete="on"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" @click="Run_phylogenetic">confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['mykey', 'dialogClose', 'title', 'seqIDs'],
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        job_name: 'myJob-test',
        email: '',
      },
    }
  },
  computed: {
    dialogVisibleSon: {
      get() {
        return this.dialogVisible
      },
      set(value) {
        this.$emit('update:dialogVisible', false)
      },
    },
  },
  methods: {
    confirm() {
      this.$emit('dialogClose', this.ruleForm)
    },

    Run_phylogenetic(data) {
      //   this.dialogVisible_phylotree = data.dialogVisible
      // if (!data.isRun) return
      this.dialogVisible = false
      this.$http
        .post('/protein/api/phylo/run/', {
          seqIDs: this.seqIDs,
          job_name: this.ruleForm.job_name,
          email: this.ruleForm.email,
        })
        .then((response) => {
          console.log(response)
          let routeData = this.$router.resolve({
            path: '/queue',
            query: {
              job_name: this.job_name,
              program: 'Phylogenetic Analysis',
            },
          })
          window.open(routeData.href, '_blank')
        })
    },

    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>

<style>
</style>