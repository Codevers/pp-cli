// eslint-define-config可以帮助我们做语法提示
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
  env: {
    browser: true,
    es2021: true,
  },
  // 解决vue3 defineProps' is not defined.
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  // 启用的规则
  extends: [
    'plugin:vue/vue3-recommended',  // 使用插件支持vue3
    'eslint:recommended', // 使用推荐的eslint
    'prettier', //将prettier的规则塞入eslint中
    'plugin:prettier/recommended', //	Make sure "prettier" is the last element in this list.
  ],
  parserOptions: {
    // js的版本
    ecmaVersion: 13,
    // 解析器
    parser: '@typescript-eslint/parser',
    // 模块化方案
    sourceType: 'module',
  },
  // 引用的插件  下载的插件去掉eslint-plugin-前缀引入
  plugins: ['vue'],
  // 自定义规则
  rules: {},
})
// module.exports = {
//   env: {
//     browser: true,
//     es2021: true
//   },
//   extends: [
//     'plugin:vue/vue3-recommended',  // 使用插件支持vue3
//     'eslint:recommended', // 使用推荐的eslint
//     'plugin:prettier/recommended', //	Make sure "prettier" is the last element in this list.
//     'prettier', //将prettier的规则塞入eslint中
//   ],
//   parser: 'vue-eslint-parser',
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module'
//   },
//   plugins: ['vue'],
//   rules: {
//     'vue/multi-word-component-names': [0], //不强制要求命名使用多字
//     'vue/component-definition-name-casing': ['error', 'kebab-case'], //组件命名必须使用连字符连接的多字命名
//     'no-debugger': 'warn',// 禁止出现debugger
//   }
// };
