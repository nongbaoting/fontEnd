module.exports = {
  // 发布 编译加base目录和Apache下的目录一致
  publicPath: process.env.NODE_ENV === 'production' ? '/protein/' : '/', // 主要
  // publicPath: process.env.NODE_ENV === 'production' ? '/protein2/' : '/', // 测试

  // devServer: {
  //   // proxy: 'http://222.200.186.47/'
  //   // proxy: 'http://localhost:8989/protein/'
  //   proxy: {
  //     'static': {
  //       // 业务类的接口请求地址，这里的api可以是后端的工程名
  //       target: 'http://222.200.186.47:8989',
  //       changeOrigin: true,
  //       pathRewrite:{
  //         "^/static":""
  //       }
     
  //     }
  //   }
  // }
}
