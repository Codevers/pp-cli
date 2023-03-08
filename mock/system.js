import { resultSuccess } from './_util'
// 账号角色信息
const UserList = [
    {
        "userId": "35076472-7c5a-4fe5-a7b5-bbe846fe386f",
        "name": "滁州初审",
        "account": "chuzhou",
        "phone": "",
        "currentCity": "滁州市建设工程造价管理协会",
        "userRole": "市级管理员",
        "userStatus": "启用",
        "addDate": "2023-01-06 10:53:06"
    },
    {
        "userId": "e994e261-cec7-40b5-b259-c7b729c3acad",
        "name": "anqing",
        "account": "anqing",
        "phone": "18951614862",
        "currentCity": "滁州市建设工程造价管理协会",
        "userRole": "市级管理员",
        "userStatus": "启用",
        "addDate": "2022-11-10 16:41:07"
    },
    {
        "userId": "01316d65-9af5-410e-a051-4862dc574e69",
        "name": "合肥测试账号",
        "account": "hefei",
        "phone": "18951614862",
        "currentCity": "合肥市建设工程造价协会",
        "userRole": "市级管理员",
        "userStatus": "启用",
        "addDate": "2022-11-02 13:43:13"
    },
    {
        "userId": "a7401696-88a1-47c4-9b4f-7504648b65ae",
        "name": "杨迎春",
        "account": "yychun",
        "phone": "",
        "currentCity": "安徽省建设工程造价管理协会",
        "userRole": "省级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 19:43:31"
    },
    {
        "userId": "959b6761-0aee-4d57-bb62-32a0cd7c2464",
        "name": "刘志军",
        "account": "lzjun",
        "phone": "",
        "currentCity": "安徽省建设工程造价管理协会",
        "userRole": "省级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 19:43:13"
    },
    {
        "userId": "bdb6f948-0f70-4cf5-a80f-02ee161ff9d5",
        "name": "洪蔚华",
        "account": "hwhua",
        "phone": "",
        "currentCity": "安徽省建设工程造价管理协会",
        "userRole": "省级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 19:42:54"
    },
    {
        "userId": "726bcac5-e528-4c69-88c4-7d25f2ff6857",
        "name": "洪梅",
        "account": "hmei",
        "phone": "",
        "currentCity": "安徽省建设工程造价管理协会",
        "userRole": "省级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 19:42:33"
    },
    {
        "userId": "f1734e8a-cc24-4b67-9685-7232e1e5fc06",
        "name": "王磊",
        "account": "wlei",
        "phone": "",
        "currentCity": "安徽省建设工程造价管理协会",
        "userRole": "省级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 19:32:46"
    },
    {
        "userId": "27c016a2-4ea4-4ee8-b2cb-7b00c4248238",
        "name": "亳州初审",
        "account": "bzhoucs",
        "phone": "",
        "currentCity": "亳州市初审机构",
        "userRole": "市级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 16:56:03"
    },
    {
        "userId": "0d44c319-dc4e-4f60-8401-e1a3f8e54b94",
        "name": "芜湖初审",
        "account": "whucs",
        "phone": "",
        "currentCity": "芜湖市初审机构",
        "userRole": "市级管理员",
        "userStatus": "启用",
        "addDate": "2022-10-31 16:55:30"
    }
]
export default [
    {
        url: "/api/manage/manageUser/page",
        method: "get",
        response: () => {
            return resultSuccess({
                dataCount: 39,
                pageCount: 4,
                pageIndex: 1,
                pageSize: 10,
                data: UserList
            })
        }
    }
];
// export default [
//     {
//         url: "/api/manage/fileSet/page?",
//         method: "get",
//         response: () => {
//             return resultSuccess({
//                 dataCount: 39,w
//                 pageCount: 4,
//                 pageIndex: 1,
//                 pageSize: 10,
//                 data: UserList
//             })
//         }
//     }
// ];