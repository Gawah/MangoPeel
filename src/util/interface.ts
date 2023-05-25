import { ParamGroup, ParamName, ParamPatchType } from "./enum";

export interface ParamData {
    name: ParamName;
    group:ParamGroup;
    preCondition?:{enable?:ParamName[],disable?:ParamName[]}[];
    toggle: ParamToggle;
    patch: ParamPatch[];
}

export interface ParamToggle {
    label?: string;
    description?: string;
    isShowPatchWhenEnable?: boolean;
    defaultEnable: boolean[];
}

export interface ParamPatch {
    label?: string;
    description?: string;
    type: ParamPatchType;
    args: any[];
    defaultValue: any[];
}
