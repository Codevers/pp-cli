import { zip } from 'fflate';
//import { baseUrl } from '@/utils'; // 下载服务器需要开启 CORS
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;

/**
 * @param data
 * @param options
 * @returns {Promise<Uint8Array>}
 */
function zipAsync(data, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      zip(data, options, (error, data) => {
        error ? reject(error) : resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function getDateTime() {
  function fillZero(input) {
    return (input + '').padStart(2, '0');
  }

  const date = new Date();
  return (
    date.getFullYear() +
    fillZero(date.getMonth() + 1) +
    fillZero(date.getDate()) +
    fillZero(date.getHours()) +
    fillZero(date.getMinutes()) +
    fillZero(date.getSeconds())
  );
}

function getFileSuffixByPath(filePath) {
  if (!filePath) return '';
  const paths = filePath.split('.');
  const suffix = paths[paths.length - 1] || '';
  return suffix ? `.${suffix}` : '';
}

export async function buildZip({ name, folders }) {
  const data = {};
  for (let folder of folders) {
    const zipFolder = (data[folder.name] = {});
    const zipFiles = [];
    // /api/manage/SelectionMaterialsManage/getFiles 接口新数据不再包含文件修改时间
    // folder.files.sort((a, b) => (a.updateTime > b.updateTime ? -1 : 1));
    //
    const categories = {};
    folder.files.map((file) => {
      file.projectName = file.projectName ?? '证明材料';
      if (categories[file.projectName] === undefined) {
        categories[file.projectName] = { current: 0, total: 1 };
      } else {
        categories[file.projectName].total += 1;
      }
    });
    //
    const tasks = folder.files.map((file) => {
      const fileIndex = categories[file.projectName] || {};
      let current = '';
      if (fileIndex.total > 1) {
        current = fileIndex.current = fileIndex.current + 1;
      }
      zipFiles.push({
        name:
          [file.projectName, /* file.subProjectName, */ current].filter((str) => !!str).join('_') +
          getFileSuffixByPath(file.filePath),
        updateTime: file.updateTime
      });
      return fetch(baseUrl + file.filePath);
    });
    const responses = await Promise.all(tasks);
    let index = 0;
    for (let res of responses) {
      const file = zipFiles[index];
      zipFolder[file.name] = [
        new Uint8Array(await res.arrayBuffer()),
        {
          // /api/manage/SelectionMaterialsManage/getFiles 接口新数据不再包含文件修改时间
          // mtime: file.updateTime
        }
      ];
      index++;
    }
  }
  const zipped = await zipAsync(data, { level: 1 });
  const blob = new Blob([zipped], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${name}_${getDateTime()}.zip`;
  a.href = url;
  a.target = '_blank';
  a.click();
  URL.revokeObjectURL(url);
}
