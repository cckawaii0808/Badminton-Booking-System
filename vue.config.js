const { defineConfig } = require('@vue/cli-service')

// 獲取儲存庫名稱，用於 GitHub Pages 部署
const repositoryName = 'Badminton-Booking-System'

module.exports = defineConfig({
  transpileDependencies: true,
  // 為 GitHub Pages 設定正確的公共路徑
  publicPath: process.env.NODE_ENV === 'production'
    ? `/${repositoryName}/`
    : '/',
  // 確保路由在 GitHub Pages 上正常工作
  chainWebpack: config => {
    // 添加 404.html 用於 SPA 路由
    config.plugin('html').tap(args => {
      args[0].filename = 'index.html'
      return args
    })
  }
})
