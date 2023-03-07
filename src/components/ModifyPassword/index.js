/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-12 10:22:01
 */
import ElementPlus from 'element-plus'
import { createApp, ref } from 'vue'
import ModifyPassword from './index.vue'
const show = ref(true)
const createDialog = () => {
    const mountNode = document.createElement('div')
    const Instance = createApp(ModifyPassword, {
        show: show.value,
        close: () => {
            Instance.unmount(mountNode);
            document.body.removeChild(mountNode);
        }


    })

    document.body.appendChild(mountNode)
    Instance.use(ElementPlus).mount(mountNode)
}

export default createDialog