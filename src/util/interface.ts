import { ParamGroup, ParamName, ParamPatchType } from "./enum";

export interface ParamData {
    name: ParamName;    //参数在配置文件中的名称
    group:ParamGroup;   //参数组名称
    preCondition:{enable?:ParamName[],disable?:ParamName[]}[]; //参数前置条件组(需要同时开启和关闭某些参数，组中有一组满足即可)
    toggle: ParamToggle;    //参数开关信息
    patchs: ParamPatch[];   //参数数值调整模块
}

export interface ParamToggle {
    label: string;     //开关栏文本
    description?: string;   //开关栏介绍内容
    isShowPatchWhenEnable?: boolean;    //开启参数时是否显示参数数值调整栏
    defaultEnable: boolean;   //默认开启状态
}

export interface ParamPatch {
    label?: string;     //参数数值调整栏文本
    description?: string;   //参数数值调整栏介绍
    type: ParamPatchType;   //数值调整模块类型
    args: any[];    //参数模块配置参数
    defaultValue?: string|number;    //默认数值
}

export interface SteamParamDefalut {
    enable:boolean,     //参数默认开启
    values?: string[]|number[];   //参数默认数值
    order?: number;    //参数排序大小
}