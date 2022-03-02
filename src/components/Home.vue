<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <router-link to="/home" class="logo">
        <span> .logo. </span>
        <span>蛋白质设计</span>
      </router-link>
      <!-- <bugReport-button></bugReport-button> -->
      <el-button type="info" @click="logout">Logout</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapsed ? '60px' : '240px'">
        <div class="toggle-button" @click="toggleSideBar">
          <i
            :class="
              isCollapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
            "
          ></i>
        </div>
        <el-menu
          unique-opened
          :collapse="isCollapsed"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.path + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[subItem.id]"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 右侧内容区 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>

        <!-- 注脚 -->
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import BugReport from './common/bugReport.vue'
export default {
  data() {
    return {
      menuList: [
        {
          //结构预测，// 一级菜单
          id: 10,
          authName: 'Structure Prediction',
          path: 'predict/structure/',
          children: [
            {
              // 二级菜单
              id: 11,
              authName: 'Sumbit',
              path: 'predict/structure/',
              children: [],
              order: null,
            },
            {
              id: 12,
              authName: 'Queue',
              path: 'predict/structure/queue/',
              children: [],
              order: null,
            },
            {
              id: 13,
              authName: 'Example',
              path: 'predict/structure/result',
              children: [],
              order: null,
            },
          ],
          order: 1,
        },
        {
          //结构相似，// 一级菜单
          id: 20,
          authName: 'Structure Similarly',
          children: [
            // 二级菜单
            {
              id: 21,
              authName: 'Submit',
              path: 'structure_similarity/submit',
              children: [],
              order: null,
            },
            // {
            //   id: 22,
            //   authName: 'Search',
            //   path: 'structure_similarity/search',
            //   children: [],
            //   order: null,
            // },
          ],
        },
      ],
      iconObj: {
        10: 'el-icon-s-opportunity',
        11: 'el-icon-edit',
        12: 'el-icon-s-goods',
        13: 'el-icon-present',

        20: 'el-icon-s-opportunity',
        21: 'el-icon-edit',
        22: 'el-icon-edit',

        125: 'el-icon-user-solid',
        103: 'el-icon-s-goods',
        101: 'el-icon-s-opportunity',
        102: 'el-icon-present',
        145: 'el-icon-orange',
      },
      isCollapsed: false,
      activePath: '',
    }
  },
  created() {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    // this.get_token()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    // async getMenuList() {
    //   const { data: res } = await this.$http.get('menus')
    //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.menuList = res.data
    //   console.log(res)
    // },
    toggleSideBar() {
      this.isCollapsed = !this.isCollapsed
    },
    saveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
    async get_token() {
      const { data: res } = await this.$http.get('get_token')
      // console.log(res)
      window.sessionStorage.setItem('X-CSRFToken', res.token)
    },
  },

  components: {
    'bugReport-button': BugReport,
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  height: 45px !important;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
  }

  > button {
    height: 35px;
    font-size: 18px;
    text-align: center;
    padding: 5px;
    background: #b4bbcf;
  }
  .logo {
    color: #fff;
  }
}

.el-aside {
  // background-color: #333744;
  background-color: #333744;
  border: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 20px;
    line-height: 25px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background-color: #fff;
  padding: 0px;
}

.el-footer {
  background-color: white;
}
</style>