<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <h5 class="subhead">Documentation</h5>
        <el-menu
          :router="true"
          :default-active="activePath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span class="headtext">BLAST</span>
            </template>
            <el-menu-item-group>
              <template slot="title"
                ><span class="groupname"> iteration BLAST</span></template
              >
              <el-menu-item
                class="headtext-2"
                index="/sequence/blast/doc/psiblast"
                >PSI-BLAST</el-menu-item
              >
              <el-menu-item index="/sequence/blast/doc/jackhmmer"
                >jackhmmer</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span class="headtext" slot="title">导航二</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18"><router-view></router-view></el-col>
    </el-row>
    <!-- <router-link type="info" to="/sequence/blast/doc/psiblast"
      >PSI-BLAST
    </router-link>
    <router-link type="info" to="/sequence/blast/doc/jackhmmer"
      >jackhmmer
    </router-link> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePath: '',
    }
  },
  created() {
    this.getActivePath()
  },
  methods: {
    getActivePath() {
      this.activePath = this.$route.path
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style lang="less"  scoped>
.el-menu-item {
  font-size: 18px;
}

/deep/ .el-menu-item-group {
  font-size: 18px;
}

.groupname {
  font-size: 16px;
}
</style>

<style lang="less" >
.subhead {
  padding: 10px;
  text-align: center;
  font-size: 20px;
}
.headtext {
  font-size: 20px;
}
.headtext-2 {
  font-size: 18px;
}
</style>