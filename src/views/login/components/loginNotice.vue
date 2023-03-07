<!-- 登录须知 弹窗 -->
<script setup>
import { onMounted, reactive, ref } from 'vue';
const timer = ref(null);
const state = reactive({
  object: [],
  left: 0,
  top: 0,
  directionX: 1,
  directionY: 1
});

const json = reactive({
  left: 100,
  top: 100,
  directionX: 1,
  directionY: 1,
  width: null,
  height: null
});

function init() {
  var obj = document.getElementById('floatLayer');
  //自定义
  obj.left = parseInt(json.left);
  obj.top = parseInt(json.top);
  obj.interval = json.interval;
  obj.directionX = json.directionX;
  obj.directionY = json.directionY;
  obj.index = state.object.length;

  timer.value = setInterval(function () {
    float(obj.index);
  }, 20);

  obj.onmouseover = function () {
    clearInterval(timer.value);
  };
  obj.onmouseout = function () {
    timer.value = setInterval(function () {
      float(obj.index);
    }, 20);
  };

  obj.style.position = 'absolute';
  obj.style.left = obj.left + 'px';
  obj.style.top = obj.top + 'px';
  obj.style.width = json.width || '';
  obj.style.height = json.height || '';
  obj.style.directionX = json.directionX;
  obj.style.directionY = json.directionY;
  state.object.push(obj);
  //   document.body.appendChild(obj);
}

function float(index) {
  var pageWidth = document.documentElement.clientWidth;
  var pageHeight = document.documentElement.clientHeight;
  var scrollLeft = document.documentElement.scrollLeft;
  var scrollTop = document.documentElement.scrollTop;
  var obj = state.object[index];

  obj.left = obj.left + obj.directionX;
  if (obj.left <= scrollLeft) {
    obj.left = scrollLeft;
    obj.directionX = 1;
  }
  if (obj.left + obj.offsetWidth >= pageWidth + scrollLeft - 1) {
    obj.left = pageWidth + scrollLeft - 1 - obj.offsetWidth;
    obj.directionX = -1;
  }

  obj.top = obj.top + obj.directionY;
  if (obj.top <= scrollTop) {
    obj.top = scrollTop;
    obj.directionY = 1;
  }
  if (obj.top + obj.offsetHeight >= pageHeight + scrollTop - 1) {
    obj.top = pageHeight + scrollTop - 1 - obj.offsetHeight;
    obj.directionY = -1;
  }

  obj.style.left = obj.left + 'px';
  obj.style.top = obj.top + 'px';
}
function close() {
  clearInterval(timer.value);
  emit('close');
}
const emit = defineEmits(['close']);

onMounted(() => {
  init();
});
</script>
<template>
  <!-- 登录须知 -->
  <div id="floatLayer">
    <h2>登录须知</h2>
    <el-icon :size="20" class="close" @click="close"><CloseBold /></el-icon>
    <el-card class="dialog">
      <div class="notice-top">
        <div class="notice-card">
          <p>
            请先查询登录用户是否为
            <br />
            “安徽省造价管理协会会员”
          </p>
          <div class="notice-card-button">
            <a
              href="http://www.ahzjxh.org.cn/SearchCenter/MemberView"
              target="_blank"
              rel="noopener noreferrer"
            >
              <el-button type="primary" round>我要查询</el-button>
            </a>
          </div>
        </div>
        <div class="notice-card">
          <p>
            未查询到会员信息
            <br />
            请先申请入会
          </p>
          <div class="notice-card-button">
            <a
              href="http://www.ahzjxh.org.cn/Home/FWRHSQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <el-button type="primary" round>我要入会</el-button>
            </a>
          </div>
        </div>
        <div class="notice-card">
          <p>
            已查询到会员信息
            <br />
            但没有会员编号
          </p>
          <div class="notice-card-footer">
            请联系“会员部”分配会员编号
            <br />
            电话: 0551-62875245、62877649
          </div>
        </div>
      </div>
      <div class="notice-content">
        <h3>已查询到会员信息且有会员编号，请按以下方式登录系统</h3>
        <p>注：其他角色的用户请联系省协会获取相关登录账号</p>
        <div class="notice-content-footer">
          <div class="notice-content-card">
            <img src="@/assets/img/qiye.png" alt="" />
            <div>
              <h4>企业会员账号</h4>
              <p>
                登录名：企业统一社会信用代码证号
                <br />
                初始密码：统一社会信用代码证后6位
              </p>
            </div>
          </div>
          <div class="notice-content-card">
            <img src="@/assets/img/geren.png" alt="" />
            <div>
              <h4>个人会员账号</h4>
              <p>
                登录名：个人身份证号
                <br />
                初始密码：身份证号后6位
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
//登录须知
#floatLayer {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  cursor: pointer;
  :deep(.el-card__body) {
    padding: 0;
  }
  h2 {
    color: white;
    font-size: 20px;
    line-height: 45px;
    height: 45px;
    text-align: center;
    background: url('@/assets/img/dialog_bg.jpg') no-repeat;
    background-size: cover;
    border-radius: 2px;
    position: relative;
  }
  .close {
    color: white;
    font-size: 25px;
    position: absolute;
    right: 10px;
    top: 12px;
  }
}
.dialog {
  width: 700px;
  position: relative;
  z-index: 1001;
  padding: 16px 25px 25px 25px;
}
.notice-top {
  display: flex;
  justify-content: space-between;
  .notice-card {
    width: 220px;
    height: 130px;
    padding: 20px 0 16px 0;
    font-size: 14px;
    background: #f0f7ff;
    box-sizing: border-box;
    p {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
      text-align: center;
    }
    .notice-card-button {
      width: 100%;
      text-align: center;
      margin-top: 16px;
    }
    .notice-card-footer {
      margin-top: 10px;
      height: 36px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #007ffd;
      line-height: 18px;
      text-align: center;
    }
  }
}
.notice-content {
  margin-top: 16px;
  background: #f0f7ff;

  padding: 20px 35px 20px 35px;
  h3 {
    width: 100%;
    height: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    text-align: center;
  }
  p {
    width: 100%;
    height: 14px;
    font-size: 12px;
    font-weight: 400;
    color: #ff2d2d;
    line-height: 16px;
    text-align: center;
  }
  .notice-content-footer {
    display: flex;
    width: 100%;
    margin-top: 20px;
    .notice-content-card {
      width: 50%;
      display: flex;
      img {
        width: 65px;
        height: 65px;
        margin-right: 15px;
      }
      h4 {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #007ffd;
        line-height: 20px;
      }
      p {
        height: 36px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 18px;
        text-align: left;
      }
    }
  }
}
</style>
