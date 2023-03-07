import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import ModifyPassword from './index.vue'

const createDialog = () => {
    return new Promise((resolve) => {
        const mountNode = document.createElement('div')
        const Instance = createApp(ModifyPassword, {
            show: true,
            close() {
                Instance.unmount(mountNode);
                document.body.removeChild(mountNode);
            },
            confirm(params) {
                resolve(params)
                this.close()
            }
        })
        document.body.appendChild(mountNode)
        Instance.use(ElementPlus).mount(mountNode)
    })
}

export default createDialog