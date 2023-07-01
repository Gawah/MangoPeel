import { localizeStrEnum } from "../i18n"
import { ParamGroup, ParamName, ParamPatchType } from "./enum"
import { ParamData } from "./interface"
export const paramList:{ [paramName: string]: ParamData }={
  [ParamName.legacy_layout]:{
    name:ParamName.legacy_layout,
    group:ParamGroup.LAYOUT,
    preCondition:[{disable:[ParamName.no_display]}],
    toggle:{
        label:localizeStrEnum.LEGACY_LAYOUT_LABEL,
        description:localizeStrEnum.LEGACY_LAYOUT_DESCRIPTION,
        defaultEnable:[true,false,false,true,true],
        isShowPatchWhenEnable:false,
    },
    patchs:[{
        type:ParamPatchType.resortableList,
        args:[{label:"CUSTOM_TEXT_CENTER",value:ParamName.custom_text_center},
        {label:"CUSTOM_TEXT",value:ParamName.custom_text},
        {label:"TIME",value:ParamName.time},
        {label:"VERSION",value:ParamName.version},
        {label:"CPU",value:ParamName.cpu_stats},
        {label:"CPU_CORE",value:ParamName.core_load},
        {label:"GPU",value:ParamName.gpu_stats},
        {label:"VRAM",value:ParamName.vram},
        {label:"RAM",value:ParamName.ram},
        {label:"BATT",value:ParamName.battery},
        {label:"FAN",value:ParamName.fan},
        {label:"FSR",value:ParamName.fsr},
        {label:"GAMESCOPE",value:ParamName.fps},
        {label:"FRAME_TIME",value:ParamName.frame_timing},
        {label:"FRAME_COUNT",value:ParamName.frame_count},
        {label:"APP",value:ParamName.debug}
        ],
        defaultValue:[
        [
            ParamName.custom_text_center,
            ParamName.custom_text,
            ParamName.time,
            ParamName.version,
            ParamName.cpu_stats,
            ParamName.core_load,
            ParamName.gpu_stats,
            ParamName.vram,
            ParamName.ram,
            ParamName.battery,
            ParamName.fan,
            ParamName.fsr,
            ParamName.fps,
            ParamName.frame_timing,
            ParamName.frame_count,
            ParamName.debug
        ],
        [
            ParamName.custom_text_center,
            ParamName.custom_text,
            ParamName.time,
            ParamName.version,
            ParamName.frame_timing,
            ParamName.cpu_stats,
            ParamName.core_load,
            ParamName.gpu_stats,
            ParamName.vram,
            ParamName.ram,
            ParamName.battery,
            ParamName.fan,
            ParamName.fsr,
            ParamName.fps,
            ParamName.frame_count,
            ParamName.debug
        ],
        [
            ParamName.custom_text_center,
            ParamName.custom_text,
            ParamName.time,
            ParamName.version,
            ParamName.battery,
            ParamName.gpu_stats,
            ParamName.cpu_stats,
            ParamName.core_load,
            ParamName.vram,
            ParamName.ram,
            ParamName.fan,
            ParamName.fsr,
            ParamName.fps,
            ParamName.frame_timing,
            ParamName.frame_count,
            ParamName.debug
        ],
        [
            ParamName.custom_text_center,
            ParamName.custom_text,
            ParamName.time,
            ParamName.version,
            ParamName.cpu_stats,
            ParamName.core_load,
            ParamName.gpu_stats,
            ParamName.vram,
            ParamName.ram,
            ParamName.battery,
            ParamName.fan,
            ParamName.fsr,
            ParamName.fps,
            ParamName.frame_timing,
            ParamName.frame_count,
            ParamName.debug
        ],
        [
            ParamName.custom_text_center,
            ParamName.custom_text,
            ParamName.time,
            ParamName.version,
            ParamName.cpu_stats,
            ParamName.core_load,
            ParamName.gpu_stats,
            ParamName.vram,
            ParamName.ram,
            ParamName.battery,
            ParamName.fan,
            ParamName.fsr,
            ParamName.fps,
            ParamName.frame_timing,
            ParamName.frame_count,
            ParamName.debug
        ],],
    }]
  },
  [ParamName.horizontal]:{
      name:ParamName.horizontal,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.no_display,ParamName.fps_only]}],
      toggle:{
          label:localizeStrEnum.HORIZONTAL_LABEL,
          description:localizeStrEnum.HORIZONTAL_DESCRIPTION,
          defaultEnable:[false,false,true,false,false],
      },
      patchs:[]
  },
  [ParamName.table_columns]:{
      name:ParamName.table_columns,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.no_display,ParamName.fps_only]}],
      toggle:{
          label:localizeStrEnum.TABLE_COLUMNS_LABEL,
          description:localizeStrEnum.TABLE_COLUMNS_DESCRIPTION,
          defaultEnable:[false,false,true,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,50,1],
          defaultValue:[3,3,14,3,3],
      }]
  },
  [ParamName.width]:{
      name:ParamName.width,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.WIDTH_LABLE,
          description:localizeStrEnum.WIDTH_DESCRIPTION,
          defaultEnable:[false,true,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,2160,1,true],
          defaultValue:[330,40,330,330,330],
      }]
  },
  [ParamName.position]:{
      name:ParamName.position,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.POSITION_LABEL,
          description:localizeStrEnum.POSITION_DESCRIPTION,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[
      {
          type:ParamPatchType.dropdown,
          args:["top-left","top-center","top-right","middle-left","middle-right","bottom-left","bottom_center","bottom-right"],
          defaultValue:["top-left","top-left","top-left","top-left","top-left"],
      }
      ]
  },
  [ParamName.hud_no_margin]:{
      name:ParamName.hud_no_margin,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.HUD_NO_MARGIN_LABEL,
          description:localizeStrEnum.HUD_NO_MARGIN_DESCRIPTION,
          defaultEnable:[false,false,true,false,false],
      },
      patchs:[]
  },

  [ParamName.offset_x]:{
      name:ParamName.offset_x,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.OFFSET_X_LABEL,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,2160,1,true],
          defaultValue:[0,0,0,0,0],
      }]
  },
      
      
  [ParamName.offset_y]:{
      name:ParamName.offset_y,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.OFFSET_Y_LABEL,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,2160,1,true],
          defaultValue:[0,0,0,0,0],
      }]
  },
      
      
  [ParamName.fps_only]:{
      name:ParamName.fps_only,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:localizeStrEnum.FPS_ONLY_LABEL,
          defaultEnable:[false,true,false,false,false],
      },
      patchs:[]
  },

  [ParamName.no_display]:{
      name:ParamName.no_display,
      group:ParamGroup.LAYOUT,
      preCondition:[],
      toggle:{
          label: localizeStrEnum.NO_DISPLAY_LABEL,
          defaultEnable:[true,false,false,false,false],
      },
      patchs:[]
  },

  [ParamName.alpha]:{
      name:ParamName.alpha,
      group:ParamGroup.SETTING,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label: localizeStrEnum.ALPHA_LABEL,
          description: localizeStrEnum.ALPHA_DESCRIPTION,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,1,0.01,false],
          defaultValue:[1,1,1,1,1],
      }]
  },

  [ParamName.background_alpha]:{
      name:ParamName.background_alpha,
      group:ParamGroup.SETTING,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label: localizeStrEnum.BACKGROUND_ALPHA_LABEL,
          description: localizeStrEnum.BACKGROUND_ALPHA_DESCRIPTION,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,1,0.01],
          defaultValue:[1,1,1,1,1],
      }]
  },
  /*
  [ParamName.no_small_font]:{
    name:ParamName.no_small_font,
    group:ParamGroup.SETTING,
    preCondition:[{disable:[ParamName.no_display]}],
    toggle:{
        label: "no_small_font",
        defaultEnable:[false,false,false,false,false],
    },
    patchs:[]
  },
  */    
      
  [ParamName.font_scale]:{
      name:ParamName.font_scale,
      group:ParamGroup.SETTING,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label: localizeStrEnum.FONT_SCALE_LABEL,
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0.1,3,0.1],
          defaultValue:[1,1,1,1,1],
      }]
  },

  [ParamName.full]:{
      name:ParamName.full,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label: localizeStrEnum.FULL_LABEL,
          description: localizeStrEnum.FULL_DESCRIPTION,
          defaultEnable:[false,false,false,false,true],
      },
      patchs:[]
  },

  [ParamName.custom_text_center] : {
      name: ParamName.custom_text_center,
      group: ParamGroup.CUSTOM,
      preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
      toggle: {
        label: localizeStrEnum.CUSTOM_TEXT_CENTER_LABEL,
        description: localizeStrEnum.CUSTOM_TEXT_CENTER_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: ["STEAM DECK", "STEAM DECK", "STEAM DECK", "STEAM DECK", "STEAM DECK"],
      }]
  },
    
  [ParamName.custom_text] : {
      name: ParamName.custom_text,
      group: ParamGroup.CUSTOM,
      preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
      toggle: {
        label: localizeStrEnum.CUSTOM_TEXT_LABEL,
        description: localizeStrEnum.CUSTOM_TEXT_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: ["MangoPeel", "MangoPeel", "MangoPeel", "MangoPeel", "MangoPeel"],
      }]
  },

  [ParamName.time] : {
    name: ParamName.time,
    group: ParamGroup.CUSTOM,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
    toggle: {
      label: localizeStrEnum.TIME_LABEL,
      description: localizeStrEnum.TIME_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },

  [ParamName.time_format] : {
    name: ParamName.time_format,
    group: ParamGroup.CUSTOM,
    preCondition: [{enable:[ParamName.time], disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
    toggle: {
      label: localizeStrEnum.TIME_FORMAT_LABEL,
      description: localizeStrEnum.TIME_FORMAT_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: [{
      type: ParamPatchType.textInput,
      args: [localizeStrEnum.TIME_FORMAT_INPUT_TITLE,[localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION1,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION2,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION3,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION4]],
      defaultValue: ["%H:%M:%S", "%H:%M:%S", "%H:%M:%S", "%H:%M:%S", "%H:%M:%S"],
    }]
  },
    
  [ParamName.version] : {
      name: ParamName.version,
      group: ParamGroup.CUSTOM,
      preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
      toggle: {
        label: localizeStrEnum.VERSION_LABEL,
        description: localizeStrEnum.VERSION_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.cpu_stats] : {
      name: ParamName.cpu_stats,
      group: ParamGroup.CPU,
      preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]}],
      toggle: {
        label: localizeStrEnum.CPU_STATS_LABEL,
        defaultEnable: [false, false, true, false, false],
      },
      patchs: []
  },
  [ParamName.cpu_text] : {
      name: ParamName.cpu_text,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display]
      }],
      toggle: {
        label: localizeStrEnum.CPU_TEXT_LABEL,
        description: localizeStrEnum.CPU_TEXT_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: ["CPU", "CPU", "CPU", "CPU", "CPU"],
      }]
  },
    
  [ParamName.cpu_load_change] : {
      name: ParamName.cpu_load_change,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CPU_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.CPU_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.core_load] : {
      name: ParamName.core_load,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CORE_LOAD_LABEL,
        description: localizeStrEnum.CORE_LOAD_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },

  [ParamName.core_load_change] : {
      name: ParamName.core_load_change,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats, ParamName.core_load],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout, ParamName.core_load],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CORE_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.CORE_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
    },
    
  [ParamName.cpu_mhz] : {
      name: ParamName.cpu_mhz,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CPU_MHZ_LABEL,
        description: localizeStrEnum.CPU_MHZ_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.cpu_power] : {
      name: ParamName.cpu_power,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CPU_POWER_LABEL,
        description: localizeStrEnum.CPU_POWER_DESCRIPTION,
        defaultEnable: [false, false, true, true, true],
      },
      patchs: []
  },
    
  [ParamName.cpu_temp] : {
      name: ParamName.cpu_temp,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.CPU_TEMP_LABEL,
        description: localizeStrEnum.CPU_TEMP_DESCRIPTION,
        defaultEnable: [false, false, false, true, true],
      },
      patchs: []
  },

  [ParamName.gpu_stats] : {
      name: ParamName.gpu_stats,
      group: ParamGroup.GPU,
      preCondition: [{
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]
      }],
      toggle: {
        label: localizeStrEnum.GPU_STATS_LABEL,
        defaultEnable: [false, false, true, false, false],
      },
      patchs: []
    },
    
  [ParamName.gpu_text] : {
      name: ParamName.gpu_text,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display]
      }],
      toggle: {
        label: localizeStrEnum.GPU_TEXT_LABEL,
        description: localizeStrEnum.GPU_TEXT_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: ["GPU", "GPU", "GPU", "GPU", "GPU"],
      }]
  },
    
  [ParamName.gpu_load_change] : {
      name: ParamName.gpu_load_change,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.GPU_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.GPU_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.gpu_core_clock] : {
      name: ParamName.gpu_core_clock,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.GPU_CORE_CLOCK_LABEL,
        description: localizeStrEnum.GPU_CORE_CLOCK_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },

  [ParamName.gpu_power] : {
      name: ParamName.gpu_power,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.GPU_POWER_LABEL,
        description: localizeStrEnum.GPU_POWER_DESCRIPTION,
        defaultEnable: [false, false, true, true, true],
      },
      patchs: []
    },
    
  [ParamName.gpu_temp] : {
      name: ParamName.gpu_temp,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.GPU_TEMP_LABEL,
        description: localizeStrEnum.GPU_TEMP_DESCRIPTION,
        defaultEnable: [false, false, false, true, true],
      },
      patchs: []
  },
    
  [ParamName.vram] : {
      name: ParamName.vram,
      group: ParamGroup.RAM,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.VRAM_LABEL,
        description: localizeStrEnum.VRAM_DESCRIPTION,
        defaultEnable: [false, false, false, true, true],
      },
      patchs: []
  },
    
  [ParamName.ram] : {
      name: ParamName.ram,
      group: ParamGroup.RAM,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.RAM_LABEL,
        description: localizeStrEnum.RAM_DESCRIPTION,
        defaultEnable: [false, false, true, true, true],
      },
      patchs: []
  },
    
  [ParamName.swap] : {
      name: ParamName.swap,
      group: ParamGroup.RAM,
      preCondition: [{
        enable: [ParamName.ram],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.SWAP_LABEL,
        description: localizeStrEnum.SWAP_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
  /*
  [ParamName.procmem] : {
    name: ParamName.procmem,
    group: ParamGroup.RAM,
    toggle: {
      label: "procem",
      description: localizeStrEnum.SWAP_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },
  [ParamName.procmem_shared] : {
    name: ParamName.procmem_shared,
    group: ParamGroup.RAM,
    toggle: {
      label: "procmem_shared",
      description: localizeStrEnum.SWAP_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },
  [ParamName.procmem_virt] : {
    name: ParamName.procmem_virt,
    group: ParamGroup.RAM,
    toggle: {
      label: "procmem_virt",
      description: localizeStrEnum.SWAP_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },
  */

  [ParamName.battery] : {
      name: ParamName.battery,
      group: ParamGroup.BATT,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.BATTERY_LABEL,
        description: localizeStrEnum.BATTERY_DESCRIPTION,
        defaultEnable: [false, false, true, true, true],
      },
      patchs: []
  },
    
  [ParamName.battery_icon] : {
      name: ParamName.battery_icon,
      group: ParamGroup.BATT,
      preCondition: [{
        enable: [ParamName.battery],
        disable: [ParamName.no_display, ParamName.fps_only]
      }, {
        enable: [ParamName.legacy_layout, ParamName.full],
        disable: [ParamName.no_display, ParamName.fps_only]
      }],
      toggle: {
        label: localizeStrEnum.BATTERY_ICON_LABEL,
        description: localizeStrEnum.BATTERY_ICON_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
  /*
  [ParamName.battery_watt] : {
    name: ParamName.battery_watt,
    group: ParamGroup.BATT,
    preCondition: [{
      enable: [ParamName.battery],
      disable: [ParamName.no_display, ParamName.fps_only]
    }, {
      enable: [ParamName.legacy_layout, ParamName.full],
      disable: [ParamName.no_display, ParamName.fps_only]
    }],
    toggle: {
      label: localizeStrEnum.BATTERY_WATT_LABEL,
      description: localizeStrEnum.BATTERY_WATT_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },

  [ParamName.battery_time] : {
    name: ParamName.battery_time,
    group: ParamGroup.BATT,
    preCondition: [{
      enable: [ParamName.battery],
      disable: [ParamName.no_display, ParamName.fps_only]
    }, {
      enable: [ParamName.legacy_layout, ParamName.full],
      disable: [ParamName.no_display, ParamName.fps_only]
    }],
    toggle: {
      label: localizeStrEnum.BATTERY_TIME_LABEL,
      description: localizeStrEnum.BATTERY_TIME_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },
  */
    
  [ParamName.fan] : {
      name: ParamName.fan,
      group: ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.FAN_LABEL,
        description: localizeStrEnum.FAN_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.fsr] : {
      name: ParamName.fsr,
      group: ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full]
      }],
      toggle: {
        label: localizeStrEnum.FSR_LABEL,
        description: localizeStrEnum.FSR_DESCRIPTION,
        defaultEnable: [false, false, false, false, false],
      },
      patchs: []
  },
    
  [ParamName.fps] : {
      name: ParamName.fps,
      group: ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.legacy_layout, ParamName.no_display]
      }],
      toggle: {
        label: localizeStrEnum.FPS_LABEL,
        description: localizeStrEnum.FPS_DESCRIPTION,
        defaultEnable: [false, true, true, false, false],
      },
      patchs: []
  },

  [ParamName.fps_color_change] : {
    name: ParamName.fps_color_change,
    group: ParamGroup.OTHER,
    preCondition: [{
      enable: [ParamName.fps],
      disable: [ParamName.legacy_layout, ParamName.no_display, ParamName.full]
    }, {
      enable: [ParamName.legacy_layout],
      disable: [ParamName.no_display, ParamName.full]
    }],
    toggle: {
      label: localizeStrEnum.FPS_COLOR_CHANGE_LABEL,
      description: localizeStrEnum.FPS_COLOR_CHANGE_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },

  [ParamName.frame_timing] : {
    name: ParamName.frame_timing,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]
    }],
    toggle: {
      label: localizeStrEnum.FRAME_TIMING_LABEL,
      description: localizeStrEnum.FRAME_TIMING_DESCRIPTION,
      defaultEnable: [false, false, true, false, false],
    },
    patchs: []
  },

  [ParamName.frame_count] : {
    name: ParamName.frame_count,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display]
    }],
    toggle: {
      label: localizeStrEnum.FRAME_COUNT_LABEL,
      description: localizeStrEnum.FRAME_COUNT_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },

  [ParamName.frametime] : {
    name: ParamName.frametime,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display]
    }],
    toggle: {
      label: localizeStrEnum.FRAME_TIME_LABEL,
      description: localizeStrEnum.FRAME_TIME_DESCRIPTION,
      defaultEnable: [false, false, false, true, true],
    },
    patchs: []
  },
  [ParamName.debug] : {
    name: ParamName.debug,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display]
    }],
    toggle: {
      label: localizeStrEnum.DEBUG_LABEL,
      description: localizeStrEnum.DEBUG_DESCRIPTION,
      defaultEnable: [false, false, false, false, false],
    },
    patchs: []
  },
  /*
  [ParamName.gpu_name]:{
      name:ParamName.gpu_name,
      group:ParamGroup.GPU,
      preCondition:[{enable:[ParamName.gpu_stats],disable:[ParamName.legacy_layout]},
                  {enable:[ParamName.legacy_layout]}],
      toggle:{
          label:"gpu_name",
          defaultEnable:[false,false,false,true,true],
      },
      patchs:[]
  }*/
  /*
  [ParamName.io_stats]:{
      name:ParamName.io_stats,
      group:ParamGroup.IO,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:"io_stats",
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[]
  }
  [ParamName.io_read]:{
      name:ParamName.io_read,
      group:ParamGroup.IO,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:"io_read",
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[]
  }
  [ParamName.io_write]:{
      name:ParamName.io_write,
      group:ParamGroup.IO,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:"io_write",
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[]
  }
  */
  /*
  [ParamName.font_size]:{
      name:ParamName.font_size,
      group:ParamGroup.SETTING,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:"font_size",
          defaultEnable:[false,false,false,false,false],
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,40,1],
          defaultValue:[24,24,24,24,24],
      }]
  }*/
  /*
  [ParamName.arch]:{
      name:ParamName.arch,
      group:ParamGroup.OTHER,
      preCondition:[{disable:[ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:"arch",
          defaultEnable:[true,false,false,true,true],
      },
      patchs:[]
  }
  [ParamName.wine]:{
      name:ParamName.wine,
      group:ParamGroup.OTHER,
      preCondition:[{disable:[ParamName.fps_only,ParamName.no_display]}],
      toggle:{
          label:"wine",
          defaultEnable:[true,false,false,true,true],
      },
      patchs:[]
  }*/
}