import { defineAsyncComponent, shallowRef } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElTableNext from 'el-table-next';  //官方文档：https://el-table-next.vercel.app/
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
const components = import.meta.glob('./*/*.vue') // 取文件夹子级index.vue组件

export function registerGlobComponent(app) {
    // 全局注册自定义组件
    for (const [key, value] of Object.entries(components)) {
        const name = key.split('/')[1]  //文件夹作为组件名
        // defineAsyncComponent异步加载组件
        app.component(name, defineAsyncComponent(value))
    }
    // 全局注册element plus icons
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
}

VXETable.setup({
    size: 'mini', // 全局尺寸
    table: {
        border: true,
        rowConfig: {
            isHover: true
        }
    }
})

export function setupComponents(app) {
    app.use(ElementPlus, {
        locale: zhCn
    })
    app.use(registerGlobComponent)
    app.use(ElTableNext)
    app.use(VXETable)
}