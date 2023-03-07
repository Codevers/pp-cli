import 'element-plus/dist/index.css'
import './styles/app.css'
import './styles/common.less'
import './styles/element-plus.less'
import 'nprogress/nprogress.css'
import './utils/axios-guard'
import 'virtual:svg-icons-register'
import 'dayjs/locale/zh-cn';
import App from './App.vue'
import { createApp } from 'vue'
import { router, setupRouter } from '@/router';
import { setupStore } from '@/store'
import { setupRouterGuard } from '@/router/guard';
import { setupComponents } from '@/components'
import print from 'vue3-print-nb'
const app = createApp(App)
// 消除警告信息
app.config.warnHandler = () => null
function start() {
    // 配置router
    setupRouter(app)
    // 配置store
    setupStore(app)
    // 路由守卫
    setupRouterGuard(router);
    // 注册全局组件
    setupComponents(app)
}
start()

app.use(print)
app.mount('#app')
