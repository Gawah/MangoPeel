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

export interface AppOverview {
    __proto__: any;
    appid: number;
    display_name: string;
    app_type: number;
    mru_index: number;
    rt_recent_activity_time: number;
    minutes_playtime_forever: string;
    minutes_playtime_last_two_weeks: number;
    rt_last_time_played_or_installed: number;
    rt_last_time_played: number;
    rt_last_time_locally_played: number;
    rt_original_release_date: number;
    rt_steam_release_date: number;
    size_on_disk: string;
    m_gameid: string;
    visible_in_game_list: boolean;
    m_ulGameId: {
        low: number;
        high: number;
        unsigned: boolean;
    };
    library_capsule_filename: string;
    most_available_clientid: string;
    selected_clientid: string;
    rt_custom_image_mtime: number;
    sort_as: string;
    association: {
        name: string;
        type: number;
    }[];
    m_setStoreCategories: Set<number>;
    m_setStoreTags: Set<number>;
    per_client_data: [
        {
            clientid: string;
            client_name: string;
            display_status: number;
            status_percentage: number;
            installed: boolean;
            bytes_downloaded: string;
            bytes_total: string;
            is_available_on_current_platform: boolean;
            cloud_status: number;
        }
    ];
    canonicalAppType: number;
    local_per_client_data: {
        clientid: string;
        client_name: string;
        display_status: number;
        status_percentage: number;
        installed: boolean;
        bytes_downloaded: string;
        bytes_total: string;
        is_available_on_current_platform: boolean;
        cloud_status: number;
    };
    most_available_per_client_data: {
        clientid: string;
        client_name: string;
        display_status: number;
        status_percentage: number;
        installed: boolean;
        bytes_downloaded: string;
        bytes_total: string;
        is_available_on_current_platform: boolean;
        cloud_status: number;
    };
    selected_per_client_data: {
        clientid: string;
        client_name: string;
        display_status: number;
        status_percentage: number;
        installed: boolean;
        bytes_downloaded: string;
        bytes_total: string;
        is_available_on_current_platform: boolean;
        cloud_status: number;
    };
    review_score_with_bombs: number;
    review_percentage_with_bombs: number;
    review_score_without_bombs: number;
    review_percentage_without_bombs: number;
    steam_deck_compat_category: number;
}

export interface AppOverviewExt extends AppOverview {
    appid: number; // base
    display_name: string; // base
    sort_as: string; // base
    icon_data: string; // base, base64 encoded image
    icon_data_format: string; // base, image type without "image/" (e.g.: jpg, png)
    icon_hash: string; // base, url hash to fetch the icon for steam games (e.g.: "/assets/" + appid + "_icon.jpg?v=" + icon_hash)
    local_cache_version: number;
}