module.exports = {
  // 发布 编译加base目录和Apache下的目录一致
  publicPath: process.env.NODE_ENV === 'production' ? '/protein/' : '/', // 47 服务器
  // publicPath: process.env.NODE_ENV === 'production' ? '/server/PROTsim/' : '/', // 超算

  
}
