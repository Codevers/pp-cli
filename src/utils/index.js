// 随机生成ID
export function randomID() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.substr(uuid.lastIndexOf('/') + 1);
}
export function exportBlobFile(data, name, suffix = "xlsx") {
    let blob = new Blob([data], {
        type: 'application/vnd.ms-excel;'
    });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', `${name}.${suffix}`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
}
export const downloadFileByBlob = (res) => {
    const url = window.URL.createObjectURL(new Blob([res], {
        type: 'application/vnd.ms-excel;'
    }));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    let downloadName = sessionStorage.getItem("blobName");
    link.setAttribute(
        "download",
        decodeURI(downloadName.split(";")[1].split("=")[1])
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
// 将整数序列化
export function numToNumRange(s, e) {
    return Array.from({ length: e - s + 1 }, (r, i) => i + s)
}
// 对象字段转小写
export function objToLowerCase(data) {
    let obj = {}
    for (let key in data) {
        obj[key.toLowerCase()] = data[key]
    }
    return obj;
}

export function strIsEmpty(obj) {
    if (typeof obj === "undefined" || obj === null || obj === "") {
        return true;
    } else {
        return false;
    }
}

//获得文件路径
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
export function getPath(file, url = 'url') {
    if (!file[url]) {
        return
    }
    if (file.raw) {
        return file[url];
    } else {
        const paths = file[url].split('/');
        paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
        return baseUrl + paths.join('/');
    }
};
//获得 图片路径 数组
export function getFileData(data, url = 'url', name = 'name') {
    let fileData = []
    const imgType = ['jpg', 'png', 'jpeg']
    data.forEach((file) => {
        //判断是图片
        let testFile = file[name]?.substring(file[name].lastIndexOf('.') + 1).toLowerCase();
        let type = imgType.includes(testFile)
        if (type && file.raw && file[url]) {
            fileData.push(file[url]);
        }

        if (type && !file.raw && file[url]) {
            const paths = file[url].split('/');
            paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
            let path = baseUrl + paths.join('/');
            fileData.push(path);
        }
    })
    return fileData
};
//获得 对应图片在数组中的下标
export function getImgindex(file, supportFiles, url = 'url', name = 'name') {
    const fileData = getFileData(supportFiles, url, name)
    const fileUrl = getPath(file, url)
    const index = fileData.findIndex((item) => item == fileUrl)
    if (index == -1) {
        return 0
    }
    return index
}





/* 富文本工具栏配置 */
export const toolbarConfig = {
    toolbarKeys: [
        'headerSelect',
        'bold',
        'clearStyle',
        'color',
        'bgColor',
        'fontSize',
        'fontFamily',
        'indent',
        'delIndent',
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'justifyJustify',
        'insertLink',
        'bulletedList',
        'numberedList',
        'uploadImage',
        'divider',
        'redo',
        'undo',
        'fullScreen'
    ]
};

//富文本 配置
import { getFilePathApi } from '@/api/announcement.js';
import { ElMessage } from 'element-plus';
export const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            async customUpload(file, insertFn) {
                let folderName = file.name;
                let formData = new FormData();
                formData.append('file', file);
                formData.append('folderName', folderName);
                getFilePathApi(formData).then((res) => {
                    insertFn(baseUrl + res.data.path);
                });
            }
        },
        insertLink: {
            checkLink: (text, link) => {
                //linkValidator
                if (link) {
                    var reg =
                        /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    if (!reg.test(link)) {
                        ElMessage.error('请输入正确的网址(例如 http://baidu.com)');
                        return;
                    }
                    return true;
                }
            }
        },
        editLink: {
            checkLink: (text, link) => {
                if (link) {
                    var reg =
                        /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    if (!reg.test(link)) {
                        ElMessage.error('请输入正确的网址(例如 http://baidu.com)');
                        return;
                    }
                    return true;
                }
            }
        }
    }
};

