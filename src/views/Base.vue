<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header class="header">
     
      <el-menu
        unique-opened
        :collapse="isCollapsed"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath"
        background-color="#029d94"
        text-color="#fff"
        active-text-color="#0d7973"
        mode="horizontal"
        popper-class="popper"
      >
        <el-menu-item index="/welcome">
          <template slot="title">
            <!-- 文本 -->
             <span> PISA </span>
            <span class="header">Home</span>
          </template>
        </el-menu-item>
        <!-- 一级菜单 -->

      <el-menu-item index="/domain_annotation/pdb_annotations">
          <template slot="title">
            <!-- 文本 -->
            <span class="header">Submit</span>
          </template>
        </el-menu-item>

         <!-- Browse -->
        <el-menu-item index="/domain_annotation/browse">
          <template slot="title">
      
            <span class="header">Browse</span>
          </template>
        </el-menu-item>

        <!-- Queue -->

        <el-menu-item index="/queue">
          <template slot="title">
            
            <span class="header">Queue</span>
          </template>
        </el-menu-item>

        <!-- about -->
        <el-menu-item index="/about">
          <template slot="title">
            <!-- 文本 -->
            <span class="header">About</span>
          </template>
        </el-menu-item>
      
      </el-menu>

      
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->

      <el-container style="padding-bottom: 20px">
        <!-- 右侧内容区 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
          <!-- <div class="foot"></div> -->
        </el-main>

        <!-- 注脚 -->
        <!-- <el-footer></el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// import BugReport from './common/bugReport.vue'
export default {
  data() {
    return {
      
      isCollapsed: false,
      activePath: '/welcome',
    }
  },
  created() {
    // this.getMenuList()
    // this.activePath = window.sessionStorage.getItem('activePath')
    this.activePath = this.$route.path
    // this.get_token()
  },
  mounted() {},

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    saveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
    async get_token() {
      const { data: res } = await this.$http.get('/protein/get_token')
      // console.log(res)
      window.sessionStorage.setItem('X-CSRFToken', res.token)
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  font-size: calc(11px + 1vmin);
}
.header {
  // font-size: 20px;
  font-size: calc(12px + 1vmin);
  color: #fff;
  // font-family: Arial, Helvetica, sans-serif;
}
.el-menu {
  // background-color: #333744;
  width: 60%;
  background-color: #029d94;
  display: flex;
  justify-self: flex-end;
  margin: 0;
  padding: 0;
  padding-left: 20px;
  border: 0;
  font-size: 20px;

  .toggle-button {
    background-color: #0d7973;

    line-height: 25px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
}

.el-menu-item {
  font-size: 18px;
}

.el-header {
  // background-color: #333744;
  background:#029d94;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  align-items: center;
  color: #fff;

  .logo {
    color: #fff;
    background-color: #029d94;
    text-decoration: none;
    font-size: 24px;
  }
}

.el-main {
  background-color: #fff;
  padding: 0px;
  // font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}

.el-footer {
  background-color: white;

.foot{
  margin-top: 30px;
}
}
</style>

<style lang="less">
/deep/ .el-menu--popup-bottom-start .popper {
  margin-top: 0px;
}
/deep/ .el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 100px;
}
</style>