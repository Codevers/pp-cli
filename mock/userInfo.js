import { resultSuccess } from './_util'
// 账号角色信息
const UserRoles = {
    userId: "ad835095-852b-407f-af2b-41a86b2ffe6d",
    userName: '@cname',
    loginName: "shengxh",
    organizationId: "013a4738-b4bf-47da-a1ec-1108a07935c9",
    organizationName: "@cword(10)",
    isNew: false,
    roleList: [
        {
            roleId: "807f0eb6-d73c-432a-86f1-28ad390d5908",
            roleName: "市级管理员"
        },
        {
            roleId: "b58437c3-42af-4304-9b8d-ffa7e3c25d94",
            roleName: "省级管理员"
        },
        {
            roleId: "390b33a0-e252-4632-8386-3fe28214fce5",
            roleName: "系统管理员"
        }
    ],
    regionLevel: 1
}
export default [
    {
        url: "/api/public/manageUser/userInfo",
        method: "get",
        response: () => {
            return resultSuccess(UserRoles)
        }
    }
];