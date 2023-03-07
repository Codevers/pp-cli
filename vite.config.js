import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      // mock配置
      viteMockServe({
        mockPath: 'mock',
        // 只在开发环境中开启
        localEnabled: command === 'serve',
        // 生产环境中关闭
        prodEnabled: false
      }),
    ],
    // 开发或生产环境服务的公共基础路径
    base: '/',
    resolve: {
      // 配置路径别名
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `
            @import "${path.resolve(__dirname, 'src/assets/styles/base.less')}";
            @import "${path.resolve(__dirname, 'src/assets/styles/mixins.less')}";
          `,
        },
      },
    },
    // 本地请求代理
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          //target: 'http://192.168.102.75:9295',
          target: 'http://192.168.102.75:9391',
          changeOrigin: true,
        },
        '/uploads': {
          // target: 'http://192.168.102.75:9295',
          target: 'http://192.168.102.75:9391',
          changeOrigin: true,
        },
        '/source': {
          target: 'http://192.168.102.75:9391',
          // target: 'http://192.168.102.58:9291',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/source/, '')
        }
      }
    }
  }
})
