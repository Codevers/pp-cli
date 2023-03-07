
<script setup>
import { ref } from 'vue'
import BaseFormItem from './BaseFormItem.vue'
const props = defineProps({
  formList: {
    type: Array,
    required: true,
    default: () => []
  },
  rules: {
    type: Object,
    required: false,
    default: () => {}
  },
  inline: {
    type: Boolean,
    required: false,
    default: () => false
  },
  formDisabled: {
    type: Boolean,
    required: false,
    default: () => false
  },
  colSize:{
    type:Number,
    required:false,
    default:()=> 6
  },
  formSize:{
    type:String,
    required:false,
    default:()=> "large"
  },
})
// 定义要emit的方法
const emit = defineEmits(['handleCascaderChange', 'changeSelect','refresh','search'])
// 初始化表单
const setFormData = () => {
  const result = {}
  props.formList.forEach((item) => {
    if (['cascader', 'checkBox'].includes[item.type]) {
      result[item.key] = item.default ? item.default : []
    } else if (item.type === 'switch') {
      result[item.key] = item.default ? item.default : false
    } else if (item.type === 'number') {
      result[item.key] = item.min ? item.min : 0
    } else {
      result[item.key] = item.default || item.default === 0 ? item.default : ''
    }
  })
  return result
}
const formData = ref(setFormData())
const ruleFormRef = ref(null)

// 明确要暴露出去的属性,使得父组件能接收到数据
defineExpose({
  state: {
    formData,
    ruleFormRef, // 校验表单时候使用
  }
})
const refresh = () => {
  emit('refresh')
  //ruleFormRef.value.resetFields();
}
const search =()=>{
  emit('search')
}
</script>
<template>
<div>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    :inline="inline"
    :disabled="formDisabled"
    :size="formSize"
    class="form-inline"
  >
    <el-row :gutter="20" align="middle">
    <el-col :span="colSize" v-for="(item,key) in formList" :key="key">  
      <base-form-item :item="item" :formData="formData"></base-form-item>
      </el-col>
      <el-col :span="colSize">
                <el-form-item  class="search-btns">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button  @click="refresh">重置</el-button>
            </el-form-item>
            </el-col>
    </el-row>
  </el-form>
</div>
</template>

<style lang="less" scoped>
.form-inline{
        padding: 20px 20px 2px 20px;
        margin: auto 0;
        .el-row{
            height: 100%;
        }
        .el-form-item {
            width: 100%;
            margin-right:0px;
            .el-select--large {
              width: 100%;
            }
            
        }
        :deep(.search-btns .el-form-item__content) {
                justify-content: center;
            } 
    }
</style>


