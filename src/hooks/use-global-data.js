/**
 $ @Description 复用性较高的字典数据
 $ @Author Peng.p
 $ @Date 2022-09-01 13:25:41
 $ @LastEditTime 2022-10-24 15:50:44
 */
import useRequest from '@/hooks/use-request';
import { GetActivityCount, getCountByType } from '@/api/common';

// 认定活动数量
export const { data: activityCount, run: getActivityCount } = useRequest(GetActivityCount, {
    deepData: true
});
