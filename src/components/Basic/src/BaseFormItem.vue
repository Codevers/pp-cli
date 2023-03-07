<script setup>
import {reactive} from 'vue';
const props = defineProps({
    item:Object,
    formData:Object,
    formDisabled:Boolean
})
   
</script>
<template>
<el-form-item 
    v-if="item.type === 'input'"
    :label="item.label" :prop="item.key" :key="item.key"
    >
        <el-input
          v-model="formData[item.key]"
          :placeholder="`请输入${item.label}`"
          :disabled="item.disabled ? item.disabled : false"
           v-bind="{...item?.itemConfigs}"
           v-on="{...item?.itemEvents}"
        ></el-input>
    </el-form-item>
    <el-form-item 
    v-else-if="item.type === 'number'"
     :label="item.label" :prop="item.key" :key="item.key"
    >
        <el-input-number
          v-model="formData[item.key]"
          :min="item.min ? item.min : -Infinity"
          :max="item.max ? item.max : Infinity"
          controls-position="right"
          v-bind="{...item?.itemConfigs}"
           v-on="{...item?.itemEvents}"
        />
    </el-form-item>
    <el-form-item 
    v-else-if="item.type === 'textarea'"
    :style="{width:item.width ? item.width : ''}"
     :label="item.label" :prop="item.key" :key="item.key"
    >
        <el-input
          v-model="formData[item.key]"
          :autosize="{ minRows: item.minRows ? item.minRows : 2,
           maxRows: item.maxRows ? item.maxRows: 4 }"
          type="textarea"
          :placeholder="`请输入${item.label}`"
          v-bind="{...item?.itemConfigs}"
           v-on="{...item?.itemEvents}"
        ></el-input>
    </el-form-item>
    <el-form-item 
    v-else-if="item.type === 'select'"
     :label="item.label" :prop="item.key" :key="item.key"
    >
      <el-select v-model="formData[item.key]"
        v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}"
        :disabled="item.disabled ? item.disabled : false"
        :placeholder="`请选择${item.label}`">
        <el-option
          v-for="opt in item.optionList"
          :key="opt.value"
          :label="item.labelName ? opt[item.labelName] : opt.label"
          :value="item.valueName ? opt[item.valueName] : opt.value"
          :disabled="opt.disabled ? opt.disabled : false"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- @change="(val) =>handleCascaderChange(val,item.key)" -->
    <el-form-item 
    v-else-if="item.type === 'cascader'"
     :label="item.label" :prop="item.key" :key="item.key"
    >
        <el-cascader
          v-model="formData[item.key]"
          :options="item.optionList"
           :show-all-levels="false"
           :placeholder="`请选择${item.label}`"
           :props="{
             value: item.valueName,
             label: item.labelName
           }"
            v-bind="{...item?.itemConfigs}"
            v-on="{...item?.itemEvents}"
        ></el-cascader>
    </el-form-item> 
    <el-form-item
    v-else-if="item.type === 'timeDay'"
    :label="item.label" :prop="item.key" :key="item.key">
      <el-date-picker v-model="formData[item.key]" type="date"
      value-format="YYYY-MM-DD"
      :placeholder="`请选择${item.label}`"
      v-bind="{...item?.itemConfigs}"
      v-on="{...item?.itemEvents}">
      </el-date-picker>
    </el-form-item>
    <el-form-item
    v-else-if="item.type === 'datetime'"
    :label="item.label" :prop="item.key" :key="item.key">
    <el-date-picker
        v-model="formData[item.key]"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="`请选择${item.label}`"
        v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item
    v-else-if="item.type === 'datetimerange'"
    :label="item.label" :prop="item.key" :key="item.key">
    <el-date-picker
        v-model="formData[item.key]"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item
    v-else-if="item.type === 'radioGroup'"
    :label="item.label" :prop="item.key" :key="item.key">
        <el-radio-group v-model="formData[item.key]" v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}">
          <el-radio v-for="radio in item.radioList" :key="radio.label"
          :label="radio.label">{{radio.name}}</el-radio>
      </el-radio-group>
  </el-form-item>
  <el-form-item
     v-else-if="item.type === 'switch'"
    :label="item.label" :prop="item.key" :key="item.key">
        <el-switch v-model="formData[item.key]" v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}"/>
  </el-form-item>
  <el-form-item
    v-else-if="item.type === 'checkBox'"
    :label="item.label" :prop="item.key" :key="item.key">
        <el-checkbox-group v-model="formData[item.key]" v-bind="{...item?.itemConfigs}"
        v-on="{...item?.itemEvents}">
          <el-checkbox :label="check.label" v-for="(check,index) in item.checkBoxList" :key="index" :disabled="check.disabled ? check.disabled : false"/>
        </el-checkbox-group>
  </el-form-item>
</template>


<style scoped lang="less">
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
    }
</style>
