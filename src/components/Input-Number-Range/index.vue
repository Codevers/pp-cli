<script>
export default {
  name: 'input-number-range'
};
</script>
<script setup>
import { ref, watchEffect, toRefs } from 'vue';

const props = defineProps({
  // 初始化范围
  defaultValue: { required: true },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },

  // 精度参数
  precision: {
    type: Number,
    default: 0,
    validator(val) {
      return val >= 0 && val === parseInt(val, 10);
    }
  }
});
const { defaultValue, disabled, precision } = toRefs(props);
console.log('props', precision);
const userInputForm = ref(null);
const userInputTo = ref(null);
// 定义要emit的方法
const emits = defineEmits(['blurfrom', 'focusfrom', 'blurto', 'focusto', 'inputfrom', 'inputto']);
watchEffect(() => {
  defaultValue.value = {
    immediate: true,
    handler(value) {
      /** 初始化范围 */
      if (value instanceof Array && precision !== undefined) {
        userInputForm.value = typeof value[0] === 'number' ? value[0] : null;
        userInputTo.value = typeof value[1] === 'number' ? value[1] : null;
      }
    }
  };
});
// 根据精度保留数字
const toPrecision = (num, precision) => {
  if (precision === undefined) precision = 0;
  return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
};

const handleBlurFrom = (event) => {
  emits('blurfrom', event);
  // 初始化数字精度
  userInputForm.value = setPrecisionValue(userInputForm.value);
};

const handleFocusFrom = (event) => {
  emits('focusfrom', event);
};

const handleBlurTo = (event) => {
  emits('blurto', event);
};

const handleFocusTo = (event) => {
  emits('focusto', event);
};

const handleInputFrom = (value) => {
  emits('inputfrom', value);
};

const handleInputTo = (value) => {
  emits('inputto', value);
};

// from输入框change事件
const handleInputChangeFrom = (value) => {
  // 如果是非数字空返回null
  if (isNaN(value) || value === '') {
    emits('input', [null, userInputTo.value]);
    emits('changefrom', userInputForm.value);
    return;
  }
  // 初始化数字精度
  userInputForm.value = setPrecisionValue(value);

  // 如果from > to 将from值替换成to
  if (typeof userInputTo.value === 'number') {
    userInputForm.value =
      parseFloat(userInputForm.value) <= parseFloat(userInputTo.value)
        ? userInputForm.value
        : userInputTo.value;
  }
  emits('input', [userInputForm.value, userInputTo.value]);
  emits('changefrom', userInputForm.value);
};

// to输入框change事件
const handleInputChangeTo = (value) => {
  // 如果是非数字空返回null
  if (isNaN(value) || value === '') {
    emits('input', [userInputForm.value, null]);
    emits('changefrom', userInputTo.value);
    return;
  }

  // 初始化数字精度
  userInputTo.value = setPrecisionValue(value);

  // 如果to < tfrom 将to值替换成from
  if (typeof userInputForm.value === 'number') {
    userInputTo.value =
      parseFloat(userInputTo.value) >= parseFloat(userInputForm.value)
        ? userInputTo.value
        : userInputForm.value;
  }
  emits('input', [userInputForm.value, userInputTo.value]);
  emits('changeto', userInputTo.value);
};
// 设置成精度数字
const setPrecisionValue = (value) => {
  if (precision.value !== undefined) {
    const val = toPrecision(value, precision.value);
    return val;
  }
  return null;
};
</script>
<template>
  <div>
    <div class="input-number-range" :class="{ 'is-disabled': disabled }">
      <div class="flex">
        <div class="from">
          <el-input
            ref="input_from"
            v-model="userInputForm"
            :disabled="disabled"
            placeholder="最小值"
            @blur="handleBlurFrom"
            @focus="handleFocusFrom"
            @input="handleInputFrom"
            @change="handleInputChangeFrom"
          ></el-input>
        </div>
        <div class="center">
          <span>至</span>
        </div>
        <div class="to">
          <el-input
            ref="input_to"
            v-model="userInputTo"
            :disabled="disabled"
            placeholder="最大值"
            @blur="handleBlurTo"
            @focus="handleFocusTo"
            @input="handleInputTo"
            @change="handleInputChangeTo"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 取消element原有的input框样式
:deep(.el-input--mini .el-input__inner) {
  border: 0px;
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
}
.input-number-range {
  background-color: #fff;
  //   border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  .center {
    margin: auto 3%;
  }
}
.is-disabled {
  background-color: #eef0f6;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
