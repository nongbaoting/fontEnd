<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: this.$route.query.username,

        password: '',
      },

      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  methods: {
    resetFrom() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        let { data: res } = await this.$http.post(
          'protein/login',
          this.loginForm
        )
        console.log(res)
        if (res.status !== 200)
          return this.$message({
            showClose: true,
            message: 'Failed! Please input correct password !',
            type: 'error',
            center: true,
            duration: 4000,
          })
        this.$message({
          showClose: true,
          message: 'Login Success!',
          type: 'success',
          center: true,
          duration: 1000,
        })
        // 保存token
        window.sessionStorage.setItem('token', res.token)
        //  跳转
        this.$router.push('home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;

  .avatar_box {
    width: 100px;
    height: 100px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    padding: 2px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    border: 1px solid #eee;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 10%;
  box-sizing: border-box;
  padding: 0 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>