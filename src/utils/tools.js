/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-08-02 15:24:56
 * @LastEditTime: 2022-09-06 09:14:12
 */
/** 
 *下载文件流
 */
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