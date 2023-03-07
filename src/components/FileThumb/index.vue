<template>
  <div class="file-thumb-list">
    <template v-for="(file, index) in fileList" :key="index">
      <el-tooltip effect="light" :content="file.name" placement="top">
        <template v-if="file.suffix.toLowerCase() === 'pdf'">
          <el-image :src="pdfIcon" fit="cover" @click="openPdf(file)" />
        </template>
        <template
          v-else-if="file.suffix.toLowerCase() === 'xlsx' || file.suffix.toLowerCase() === 'xls'"
        >
          <!-- <el-image :src="excelIcon" fit="cover" @click="openPdf(file)" /> -->
          <a
            :href="getPath(file)"
            v-bind="file.suffix.toLowerCase() != 'pdf' ? { download: file.name } : {}"
            target="_blank"
          >
            <img class="img" src="@/assets/img/excel.png" />
          </a>
        </template>
        <template v-else>
          <el-image
            preview-teleported
            :preview-src-list="images"
            :initial-index="index"
            :src="getPath(file)"
            :fit="fit"
          />
        </template>
      </el-tooltip>
    </template>
  </div>
</template>

<script>
//import { baseUrl } from '@/utils';
import pdfIcon from '../../assets/img/pdf.png';
import excelIcon from '../../assets/img/excel.png';
import { getPath } from '@/utils/index.js';

const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;

export default {
  name: 'FileThumb',
  props: {
    fileList: {
      type: Array,
      default() {
        return [
          // {
          //   id: '4fcb9eff-7fa4-48e1-bb42-70e82b9e9d68',
          //   name: '007.png',
          //   suffix: 'png',
          //   url: 'uploads/Temp/2022-09-01/006.png'
          // },
          // {
          //   id: '4fcb9eff-7fa4-48e1-bb42-70e82b9e9d68',
          //   name: '007.png',
          //   suffix: 'png',
          //   url: 'uploads/Temp/2022-09-01/007.png'
          // },
          // {
          //   id: '38ba6994-9bff-46bf-9556-b505d673ec08',
          //   name: 'javascript高级程序设计.pdf',
          //   suffix: 'pdf',
          //   url: 'uploads/Temp/2022-09-01/javascript高级程序设计.pdf'
          // }
        ];
      }
    },
    fit: {
      type: String,
      default: 'cover'
    }
  },
  data() {
    return {
      baseUrl,
      pdfIcon,
      excelIcon,
      images: []
    };
  },
  watch: {
    fileList: {
      handler() {
        this.images = this.fileList
          .filter((file) => file.suffix !== 'pdf')
          .map((file) => getPath(file));
      },
      immediate: true
    }
  },
  methods: {
    getPath,
    openPdf(file) {
      window.open(getPath(file) + `?attname= ${file.name}`, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
.file-thumb-list {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  // margin: 0 -10px -10px 0;

  .el-image {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }

  .el-image {
    margin: 0 10px 10px 0;
  }
}
</style>
