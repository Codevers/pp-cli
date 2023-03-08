import { resultSuccess } from './_util'
// 用户权限菜单
export const UserMenuList = [
    {
        "id": "b7650a02-250e-4d64-893f-048db8260c1b",
        "name": "省评工作台",
        "path": "",
        "component": "dashboard/province",
        "icon": "",
        "children": null
    },
    {
        "id": "7f44c153-2e2f-41ca-90e4-3f0055c7a830",
        "name": "账户管理",
        "path": "",
        "component": "",
        "icon": "",
        "children": [
            {
                "id": "e2a70bb2-a595-490b-a359-9b4d1318d48d",
                "name": "修改密码",
                "path": "",
                "component": "account/modifyPassword",
                "icon": "",
                "children": null
            }
        ]
    },
    {
        "id": "b7584f3a-0e8c-4044-9e35-bed5136ae02e",
        "name": "系统管理",
        "path": "",
        "component": "",
        "icon": "",
        "children": [
            {
                "id": "92142cb7-ba67-489a-ad5b-4c5787de3036",
                "name": "用户管理",
                "path": "",
                "component": "system/userAdmin",
                "icon": "",
                "children": null
            },
            {
                "id": "89bb1ead-eaca-4a60-8180-3d2a49ce37da",
                "name": "附件管理",
                "path": "",
                "component": "system/fileAdmin",
                "icon": "",
                "children": null
            },
            {
                "id": "c4db58eb-4af4-4ac4-aeaf-06ccc37eabd6",
                "name": "菜单管理",
                "path": "",
                "component": "system/menuAdmin",
                "icon": "",
                "children": null
            },
            {
                "id": "02b68287-4b65-4e96-8ed6-b242a0df2346",
                "name": "组织机构管理",
                "path": "",
                "component": "system/organizationAdmin",
                "icon": "",
                "children": null
            },
            {
                "id": "6fb8b531-1bfb-4f61-b719-06dd890cd6bb",
                "name": "角色管理",
                "path": "",
                "component": "system/roleAdmin",
                "icon": "",
                "children": null
            },
            {
                "id": "97d8b975-f4ce-40c9-9905-db66f153db49",
                "name": "文件管理",
                "path": "",
                "component": "system/fileManager",
                "icon": "",
                "children": null
            }
        ]
    }
]
export default [
    {
        url: "/api/public/menu/list",
        method: "get",
        response: () => {
            return resultSuccess(UserMenuList)
        }
    }
];