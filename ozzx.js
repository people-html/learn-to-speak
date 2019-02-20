module.exports = {
  // 项目根目录
  root: "/src",
  // 项目入口文件
  entry: "main",
  // 页面标题
  title: '页面',
  // 输出目录
  outFolder: "./dist",
  // 是否监测文件改动重新打包
  watcher: {
    // 是否启用
    enable: true,
    // 监控的文件夹 默认'./src'
    folder: './src',
    // 忽略监控的文件或文件夹，支持正则，默认为输出目录
    ignored: './dist/*',
    // 监测深度,默认99
    depth: 99
  },
  // 输出配置
  outPut: {
    // 是否压缩css
    minifyCss: false,
    // 是否压缩js
    minifyJs: false,
    // 强制打包所有样式
    choiceAnimation: false,
    // 全局样式文件
    globalStyle: './src/main.css',
    // 输出文件自动追加版本号，可以用来消除缓存
    outFileAddVersion: true,
  },
  serverPort: 8000,
  // 静态文件服务
  server: true,
  // 自动重新加载
  autoReload: true,
  // head属性清单
  headList: [
    {
      'http-equiv': 'content-type',
      content: 'text/html; charset=UTF-8',
    },
    {
      name: 'viewport',
      content: 'initial-scale=1,user-scalable=no,maximum-scale=1',
    }
  ],
  // 使用到的外部脚本清单
  scriptList: [
  ],
  // 页面清单
  pageList: [
    {
      // 是否为页面主入口
      main: true,
      isPage: true,
      name: 'main',
      src: './src/page/main.page'
    }
  ]
}