<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-22 13:45:39
 * @LastEditors: wsy
 * @LastEditTime: 2022-07-29 16:59:17
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
import {
    Menu as IconMenu, Download
} from '@element-plus/icons-vue'
import BaseTableColumn from "./BaseTableColumn";
const props = defineProps({
  tableData: {
    type: Object,
    required: true,
    default: () => {}
  },
  columns:{
    type: Array,
    required: true,
    default: () => []
  },
  tableBtns:{
    type: Array,
    required: true,
    default:{
      isNeedOperation:true,//确定是否需要操作列
      btns:[{
      type:"primary",
      label:"编辑",
      size:"large",
      configs:{
        link:true
      },
      handleClick:(row)=>{
        console.log(row)
      }
      }]
    }
  }
})
const formInline = reactive({
  accountId: '',
  ip:'',
  operationTime:[]
})
const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    })
// 分页导航
const handleCurrentChange = (val)=>{
pageIndex.value = val;
}
//切换分页条数
const handleSizeChange = (val) =>{
pageSize.value = val;
}
const {pageIndex,pageSize} = toRefs(pagination);
// 明确要暴露出去的属性,使得父组件能接收到数据
defineExpose({
    pagination  
})
</script>
<template>  
    <el-table :data="tableData?.data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)" style="width: 100%">
        <el-table-column type="index" fixed label="序号"  width="80"/>
        <!-- <div v-for="item in columns" :key="item.key"> -->
        <!-- <base-table-column
         v-if="column.render"
        :prop="item.key" 
        :label="item.label" 
        :width="item.width"
        :align="item.align"
        :render="item.render"
        v-bind="{...item?.config}"
        ></base-table-column>
         <el-table-column 
          v-else
          :key="item.prop" 
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :align="item?.align||left"
          v-bind="{...item?.config}">
          </el-table-column>
        </div> -->
        <!-- <el-table-column v-for="item in columns"
        :key="item.prop" 
        :prop="item.prop" 
        :label="item.label" 
        :width="item.width"
        :align="item?.align||left"
        v-bind="{...item?.config}"
       
        > -->
         <!-- v-html="{...item?.template}" -->
        <!-- <template #default="scope" v-if="item?.isTemplate||false">
          {{item.template(scope.row)}}
          </template> -->
        <!-- </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="180" v-if="tableBtns.isNeedOperation">
        <template #default="scope">
            <el-button v-for="item in tableBtns.btns" 
            :type="item.type" 
            :key="item.label"
            :size="item.size" 
            v-bind="{...item?.configs}" 
            @click="item.handleClick(scope.row)"
            >{{item.label}}</el-button
            >
        </template>
        </el-table-column>
    </el-table>
  <el-pagination
      v-model:currentPage="pageIndex"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData?.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"     
    />
</template>

<style scoped lang="less">
.el-pagination{
        justify-content: flex-end;
    }
</style>
