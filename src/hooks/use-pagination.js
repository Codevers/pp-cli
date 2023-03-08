/**
 $ @Description 分页hooks
 $ @Author Peng.p
 $ @Date 2022-07-29 14:30:03
 $ @LastEditTime 2023-03-08 11:04:22
 */
import { ref, onMounted, toRefs, reactive } from 'vue'
import { pageConfig } from '@/config/pagination';
import useRequest from '@/hooks/use-request';
const { pageIndex, pageSize } = pageConfig;
const optionConfig = {
  manual: false,
  onSuccess() { }
}

export default function usePagination(params = {}, api, config = optionConfig) {
  const dataSource = ref([])
  const loading = ref(false)
  const total = ref(0)
  const page = reactive({
    pageIndex,
    pageSize
  })

  onMounted(() => {
    !config.manual && getData()
  })

  // 计算表索引
  const getSortIndex = (index, pageIndex, pageSize) => {
    return index + 1 + (pageIndex - 1) * pageSize;
  }

  // 获取表格数据
  function getData(paramsApi) {
    const { pageIndex, pageSize } = page
    const getParams = { ...params, pageIndex, pageSize }
    const getApi = paramsApi || api;
    loading.value = true;
    return new Promise((resolve) => {
      useRequest(() => getApi(getParams), {
        onSuccess: ({ data }, isSuccess) => {
          try {
            if (!isSuccess) return
            const { dataCount, total: totalAll } = data;
            total.value = dataCount !== undefined ? dataCount : totalAll
            // 设置索引
            data.data.forEach((item, index) => {
              item.index = getSortIndex(index, pageIndex, pageSize)
            })
            dataSource.value = data.data
            // 执行成功回调
            if (isSuccess && config?.onSuccess) {
              config.onSuccess(data.data, isSuccess)
              resolve(data.data)
            }
          } catch (error) {
            console.error(error)
          }
          loading.value = false;
        },
        onError: () => {
          loading.value = false;
        }
      });
    })
  }
  // 分页组件触发
  function handlePageChange(val) {
    const { pageSize, pageIndex } = val
    page.pageIndex = pageIndex || page.pageIndex
    page.pageSize = pageSize || page.pageSize
    getData()
  }
  async function run($event, paramsApi) {
    const apiParmas = $event?.target ? paramsApi : $event;
    page.pageIndex = 1 // 重置分页
    return await getData(apiParmas)
  }

  return {
    dataSource,
    handlePageChange,
    loading,
    total,
    page,
    run
  }
}