
<template>
  <div>
    <div>
      <el-row>
        <el-button
          @click="drawer = true"
          type="primary"
          style="margin-left: 16px"
        >
          Bug Report
        </el-button>
      </el-row>
    </div>

    <el-drawer
      title="有什么建议欢迎留言！我可以更好的改进此网页！"
      :visible.sync="drawer"
      :direction="direction"
    >
      <span
        ><form>
          <el-input
            class="input_text"
            type="textarea"
            v-model="textContent"
            :autosize="{ minRows: 4, maxRows: 20 }"
          ></el-input>
        </form>
      </span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: [''],
  data() {
    return {
      drawer: false,
      direction: 'btt',
      textContent: '',
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
}
</script>

<style lang="less">
.input_text {
  font-size: 1.4em;
}
</style>