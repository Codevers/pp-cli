<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-25 10:28:19
 * @LastEditors: wsy
 * @LastEditTime: 2022-08-03 17:37:42
-->
<script setup>
import { reactive, toRefs, ref, watch, onMounted, watchEffect } from 'vue';
const technicalFormRef = ref(null);
const props = defineProps({
  dialogVisible: Boolean,
  formData: Object
});
let formInline = reactive({
  name: '',
  sex: '',
  companyType: '',
  major: '',
  technical: '',
  idCard: '',
  qualification: '',
  companyName: '',
  education: '',
  phone: '',
  qualification: ''
});
const { dialogVisible, formData } = toRefs(props);
console.log(formData);
watchEffect(() => {
  if (formData) {
    technicalFormRef.value = formData;
  }
});
const emits = defineEmits(['closeDialog', 'submitDialog']);
const closeDialog = () => {
  technicalFormRef.value.resetFields();
  emits('closeDialog', false);
};
const submitDialog = () => {
  technicalFormRef.value.validate((val) => {
    emits('submitDialog', formInline);
  });
};
// // 明确要暴露出去的属性,使得父组件能接收到数据
// defineExpose({
//     technicalFormRef // 校验表单时候使用
// })
const inputChange = () => {
  const reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (reg.test(formInline.idCard)) {
    let sexCode = formInline.idCard.substring(16, 17);
    let sex = sexCode % 2 == 1 ? '男' : '女';
    formInline.sex = sex;
  }
};
</script>
<template>
  <el-dialog v-model="dialogVisible" title="添加专家" width="50%" :close-on-click-modal="false">
    <el-form
      :inline="true"
      ref="technicalFormRef"
      :model="formInline"
      class="form-inline"
      label-width="35%"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入姓名" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="formInline.idCard"
              placeholder="请输入身份证号"
              maxlength="18"
              @input="inputChange"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-input
              v-model="formInline.sex"
              placeholder="请先输入身份证号"
              autocomplete="off"
              readonly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历" prop="education">
            <el-select v-model="formInline.education" placeholder="请选择学历">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="formInline.phone" placeholder="请输入手机号码" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业" prop="major">
            <el-select v-model="formInline.major" placeholder="请选择专业">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执业资格及注册证号" prop="qualification">
            <el-input
              v-model="formInline.qualification"
              placeholder="请输入执业资格及注册证号"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术职称" prop="technical">
            <el-input
              v-model="formInline.technical"
              placeholder="请输入技术职称"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位类型" prop="companyType">
            <el-select v-model="formInline.companyType" placeholder="请选择单位类型">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在单位" prop="companyName">
            <el-input
              v-model="formInline.companyName"
              placeholder="请输入所在单位"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitDialog">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.form-inline {
  padding-right: 20px;
  margin: auto 0;
  .el-form-item {
    margin: 10px;
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
}
</style>
