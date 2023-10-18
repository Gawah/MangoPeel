import { localizeStrEnum } from "../../i18n"
import { ParamGroup, ParamName, ParamPatchType, ResortType } from "../enum"
import { ParamData, SteamParamDefalut } from "../interface"
export const paramList:{ [paramName: string]: ParamData }={
  [ParamName.preset]:{
    name:ParamName.preset,
    group:ParamGroup.PRESET,
    preCondition:[],
    toggle:{
        label:localizeStrEnum.PRESET_LABEL,
        description:localizeStrEnum.PRESET_DESCRIPTION,
        defaultEnable:false,
        isShowPatchWhenEnable:true,
    },
    patchs:[{
      type:ParamPatchType.notchSlider,
      args:[0,1,2,3,4]
    }]
  },
  [ParamName.legacy_layout]:{
    name:ParamName.legacy_layout,
    group:ParamGroup.LAYOUT,
    preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
    toggle:{
        label:localizeStrEnum.LEGACY_LAYOUT_LABEL,
        description:localizeStrEnum.LEGACY_LAYOUT_DESCRIPTION,
        defaultEnable:true,
        isShowPatchWhenEnable:false,
    },
    patchs:[{
        type:ParamPatchType.resortableList,
        args:[ResortType.paramOrder],
    }]
  },
  [ParamName.horizontal]:{
      name:ParamName.horizontal,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.no_display,ParamName.fps_only,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.HORIZONTAL_LABEL,
          description:localizeStrEnum.HORIZONTAL_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[]
  },
  [ParamName.table_columns]:{
      name:ParamName.table_columns,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.legacy_layout,ParamName.no_display,ParamName.fps_only,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.TABLE_COLUMNS_LABEL,
          description:localizeStrEnum.TABLE_COLUMNS_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,50,1],
          defaultValue:3,
      }]
  },
  [ParamName.width]:{
      name:ParamName.width,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.fps_only,ParamName.no_display,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.WIDTH_LABLE,
          description:localizeStrEnum.WIDTH_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,2160,1,true],
          defaultValue:330,
      }]
  },
  [ParamName.position]:{
      name:ParamName.position,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.POSITION_LABEL,
          description:localizeStrEnum.POSITION_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.dropdown,
          args:["top-left","top-center","top-right","middle-left","middle-right","bottom-left","bottom_center","bottom-right"],
          defaultValue:"top-left"
      }]
  },
  [ParamName.hud_no_margin]:{
      name:ParamName.hud_no_margin,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.HUD_NO_MARGIN_LABEL,
          description:localizeStrEnum.HUD_NO_MARGIN_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[]
  },

  [ParamName.offset_x]:{
      name:ParamName.offset_x,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.OFFSET_X_LABEL,
          description:localizeStrEnum.OFFSET_X_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,2160,1,true],
          defaultValue:0,
      }]
  },
      
      
  [ParamName.offset_y]:{
      name:ParamName.offset_y,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label:localizeStrEnum.OFFSET_Y_LABEL,
          description:localizeStrEnum.OFFSET_Y_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,2160,1,true],
          defaultValue:0,
      }]
  },

  [ParamName.full]:{
    name:ParamName.full,
    group:ParamGroup.LAYOUT,
    preCondition:[{disable:[ParamName.fps_only,ParamName.no_display,ParamName.preset]}],
    toggle:{
        label: localizeStrEnum.FULL_LABEL,
        description: localizeStrEnum.FULL_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },

  [ParamName.no_display]:{
      name:ParamName.no_display,
      group:ParamGroup.LAYOUT,
      preCondition:[{disable:[ParamName.preset]}],
      toggle:{
          label: localizeStrEnum.NO_DISPLAY_LABEL,
          defaultEnable:false,
      },
      patchs:[]
  },

  [ParamName.alpha]:{
      name:ParamName.alpha,
      group:ParamGroup.ALPHA,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label: localizeStrEnum.ALPHA_LABEL,
          description: localizeStrEnum.ALPHA_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,1,0.01,false],
          defaultValue:1,
      }]
  },

  [ParamName.background_alpha]:{
      name:ParamName.background_alpha,
      group:ParamGroup.ALPHA,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label: localizeStrEnum.BACKGROUND_ALPHA_LABEL,
          description: localizeStrEnum.BACKGROUND_ALPHA_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0,1,0.01],
          defaultValue:1,
      }]
  },
  /*
  [ParamName.no_small_font]:{
    name:ParamName.no_small_font,
    group:ParamGroup.SETTING,
    preCondition:[{disable:[ParamName.no_display]}],
    toggle:{
        label: "no_small_font",
        defaultEnable:false,
    },
    patchs:[]
  },
  */
      
  [ParamName.font_scale]:{
      name:ParamName.font_scale,
      group:ParamGroup.FONT,
      preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
      toggle:{
          label: localizeStrEnum.FONT_SCALE_LABEL,
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[0.1,3,0.1],
          defaultValue:1,
      }]
  },

  [ParamName.custom_text_center] : {
      name: ParamName.custom_text_center,
      group: ParamGroup.CUSTOM_TEXT,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CUSTOM_TEXT_CENTER_LABEL,
        description: localizeStrEnum.CUSTOM_TEXT_CENTER_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: "STEAM DECK",
      }]
  },
    
  [ParamName.custom_text] : {
      name: ParamName.custom_text,
      group: ParamGroup.CUSTOM_TEXT,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CUSTOM_TEXT_LABEL,
        description: localizeStrEnum.CUSTOM_TEXT_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: "MangoPeel",
      }]
  },

  [ParamName.time] : {
    name: ParamName.time,
    group: ParamGroup.CUSTOM_TEXT,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.TIME_LABEL,
      description: localizeStrEnum.TIME_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.time_format] : {
    name: ParamName.time_format,
    group: ParamGroup.CUSTOM_TEXT,
    preCondition: [{
      enable:[ParamName.time]
    }],
    toggle: {
      label: localizeStrEnum.TIME_FORMAT_LABEL,
      description: localizeStrEnum.TIME_FORMAT_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: [{
      type: ParamPatchType.textInput,
      args: [localizeStrEnum.TIME_FORMAT_INPUT_TITLE,[localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION1,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION2,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION3,localizeStrEnum.TIME_FORMAT_INPUT_DESCRIPTION4]],
      defaultValue: "%H:%M:%S"
    }]
  },
    
  [ParamName.cpu_stats] : {
      name: ParamName.cpu_stats,
      group: ParamGroup.CPU,
      preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
      toggle: {
        label: localizeStrEnum.CPU_STATS_LABEL,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_cpu_load]:{
    name: ParamName.graphs_cpu_load,
    group: ParamGroup.CPU,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_CPU_LOAD_LABEL,
      description: localizeStrEnum.GRAPHS_CPU_LOAD_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.cpu_text] : {
      name: ParamName.cpu_text,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CPU_TEXT_LABEL,
        description: localizeStrEnum.CPU_TEXT_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: "CPU_TEXT",
      }]
  },
    
  [ParamName.cpu_load_change] : {
      name: ParamName.cpu_load_change,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CPU_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.CPU_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.core_load] : {
      name: ParamName.core_load,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CORE_LOAD_LABEL,
        description: localizeStrEnum.CORE_LOAD_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.core_load_change] : {
      name: ParamName.core_load_change,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats, ParamName.core_load],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout, ParamName.core_load],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CORE_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.CORE_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
    },
    
  [ParamName.cpu_mhz] : {
      name: ParamName.cpu_mhz,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CPU_MHZ_LABEL,
        description: localizeStrEnum.CPU_MHZ_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.cpu_power] : {
      name: ParamName.cpu_power,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CPU_POWER_LABEL,
        description: localizeStrEnum.CPU_POWER_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.cpu_temp] : {
      name: ParamName.cpu_temp,
      group: ParamGroup.CPU,
      preCondition: [{
        enable: [ParamName.cpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      },{
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.CPU_TEMP_LABEL,
        description: localizeStrEnum.CPU_TEMP_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_cpu_temp]:{
    name: ParamName.graphs_cpu_temp,
    group: ParamGroup.CPU,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_CPU_TEMP_LABEL,
      description: localizeStrEnum.GRAPHS_CPU_TEMP_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.gpu_stats] : {
      name: ParamName.gpu_stats,
      group: ParamGroup.GPU,
      preCondition: [{
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_STATS_LABEL,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_gpu_load]:{
    name: ParamName.graphs_gpu_load,
    group: ParamGroup.GPU,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_GPU_LOAD_LABEL,
      description: localizeStrEnum.GRAPHS_GPU_LOAD_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },
    
  [ParamName.gpu_text] : {
      name: ParamName.gpu_text,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_TEXT_LABEL,
        description: localizeStrEnum.GPU_TEXT_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: [{
        type: ParamPatchType.textInput,
        args: [],
        defaultValue: "GPU_TEXT",
      }]
  },
    
  [ParamName.gpu_load_change] : {
      name: ParamName.gpu_load_change,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_LOAD_CHANGE_LABEL,
        description: localizeStrEnum.GPU_LOAD_CHANGE_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.gpu_core_clock] : {
      name: ParamName.gpu_core_clock,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_CORE_CLOCK_LABEL,
        description: localizeStrEnum.GPU_CORE_CLOCK_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_gpu_core_clock]:{
    name: ParamName.graphs_gpu_core_clock,
    group: ParamGroup.GPU,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_GPU_CORE_CLOCK_LABEL,
      description: localizeStrEnum.GRAPHS_GPU_CORE_CLOCK_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.gpu_power] : {
      name: ParamName.gpu_power,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_POWER_LABEL,
        description: localizeStrEnum.GPU_POWER_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
    },
    
  [ParamName.gpu_temp] : {
      name: ParamName.gpu_temp,
      group: ParamGroup.GPU,
      preCondition: [{
        enable: [ParamName.gpu_stats],
        disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout],
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.GPU_TEMP_LABEL,
        description: localizeStrEnum.GPU_TEMP_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_gpu_temp]:{
    name: ParamName.graphs_gpu_temp,
    group: ParamGroup.GPU,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_GPU_TEMP_LABEL,
      description: localizeStrEnum.GRAPHS_GPU_TEMP_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },
    
  [ParamName.ram] : {
      name: ParamName.ram,
      group: ParamGroup.RAM,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.RAM_LABEL,
        description: localizeStrEnum.RAM_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.graphs_ram]:{
    name: ParamName.graphs_ram,
    group: ParamGroup.RAM,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_RAM_LABEL,
      description: localizeStrEnum.GRAPHS_RAM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },


  [ParamName.swap] : {
    name: ParamName.swap,
    group: ParamGroup.RAM,
    preCondition: [{
      enable: [ParamName.ram],
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.SWAP_LABEL,
      description: localizeStrEnum.SWAP_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
},

  [ParamName.vram] : {
    name: ParamName.vram,
    group: ParamGroup.RAM,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.VRAM_LABEL,
      description: localizeStrEnum.VRAM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.graphs_vram]:{
    name: ParamName.graphs_vram,
    group: ParamGroup.RAM,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_VRAM_LABEL,
      description: localizeStrEnum.GRAPHS_VRAM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.gpu_mem_clock] : {
    name: ParamName.gpu_mem_clock,
    group: ParamGroup.RAM,
    preCondition: [{
      enable:[ParamName.vram],
      disable:[ParamName.full]
    }],
    toggle: {
      label: localizeStrEnum.GPU_MEM_LABEL,
      description: localizeStrEnum.GPU_MEM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.graphs_gpu_mem_clock]:{
    name: ParamName.graphs_gpu_mem_clock,
    group: ParamGroup.RAM,
    preCondition: [{disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]}],
    toggle: {
      label: localizeStrEnum.GRAPHS_GPU_MEM_CLOCK_LABEL,
      description: localizeStrEnum.GRAPHS_GPU_MEM_CLOCK_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.procmem] : {
    name: ParamName.procmem,
    group: ParamGroup.RAM,
    preCondition:[{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.PROCMEM_LABEL,
      description: localizeStrEnum.PROCMEM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },
  [ParamName.procmem_shared] : {
    name: ParamName.procmem_shared,
    group: ParamGroup.RAM,
    preCondition:[{
      enable: [ParamName.procmem]
    }],
    toggle: {
      label: localizeStrEnum.PROCMEM_SHARED_LABEL,
      description: localizeStrEnum.PROCMEM_SHARED_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },
  [ParamName.procmem_virt] : {
    name: ParamName.procmem_virt,
    group: ParamGroup.RAM,
    preCondition:[{
      enable: [ParamName.procmem]
    }],
    toggle: {
      label: localizeStrEnum.PROCMEM_VIRT_LABEL,
      description: localizeStrEnum.PROCMEM_VIRT_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.battery] : {
      name: ParamName.battery,
      group: ParamGroup.BATT,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.BATTERY_LABEL,
        description: localizeStrEnum.BATTERY_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.battery_icon] : {
      name: ParamName.battery_icon,
      group: ParamGroup.BATT,
      preCondition: [{
        enable: [ParamName.battery],
        disable: [ParamName.no_display, ParamName.fps_only,ParamName.preset]
      }, {
        enable: [ParamName.legacy_layout, ParamName.full],
        disable: [ParamName.no_display, ParamName.fps_only,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.BATTERY_ICON_LABEL,
        description: localizeStrEnum.BATTERY_ICON_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
  
  [ParamName.battery_watt] : {
    name: ParamName.battery_watt,
    group: ParamGroup.BATT,
    preCondition: [{
      enable: [ParamName.battery],
    }],
    toggle: {
      label: localizeStrEnum.BATTERY_WATT_LABEL,
      description: localizeStrEnum.BATTERY_WATT_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.battery_time] : {
    name: ParamName.battery_time,
    group: ParamGroup.BATT,
    preCondition: [{
      enable: [ParamName.battery],
    }],
    toggle: {
      label: localizeStrEnum.BATTERY_TIME_LABEL,
      description: localizeStrEnum.BATTERY_TIME_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.version] : {
    name: ParamName.version,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.VERSION_LABEL,
      description: localizeStrEnum.VERSION_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
},
    
  [ParamName.fan] : {
      name: ParamName.fan,
      group: ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.FAN_LABEL,
        description: localizeStrEnum.FAN_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },
    
  [ParamName.fsr] : {
      name: ParamName.fsr,
      group: ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle: {
        label: localizeStrEnum.FSR_LABEL,
        description: localizeStrEnum.FSR_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.hide_fsr_sharpness] : {
    name: ParamName.hide_fsr_sharpness,
    group: ParamGroup.OTHER,
    preCondition: [{
      enable: [ParamName.fsr]
    },{
      enable: [ParamName.legacy_layout,ParamName.full]
    }
    ],
    toggle: {
      label: localizeStrEnum.HIDE_FSR_SHARPNESS_LABEL,
      description: localizeStrEnum.HIDE_FSR_SHARPNESS_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
},
    
  [ParamName.fps] : {
      name: ParamName.fps,
      group: ParamGroup.FPS,
      preCondition: [{
        disable: [ParamName.legacy_layout, ParamName.no_display,ParamName.preset,ParamName.fps_only]
      }],
      toggle: {
        label: localizeStrEnum.FPS_LABEL,
        description: localizeStrEnum.FPS_DESCRIPTION,
        defaultEnable: false,
      },
      patchs: []
  },

  [ParamName.fps_only]:{
    name:ParamName.fps_only,
    group:ParamGroup.FPS,
    preCondition:[{disable:[ParamName.no_display,ParamName.preset]}],
    toggle:{
        label:localizeStrEnum.FPS_ONLY_LABEL,
        defaultEnable:false,
    },
    patchs:[]
},

  [ParamName.frametime] : {
    name: ParamName.frametime,
    group: ParamGroup.FPS,
    preCondition: [{
      enable: [ParamName.fps],
      disable: [ParamName.fps_only, ParamName.no_display,ParamName.preset]
    },{
      enable:[ParamName.legacy_layout],
      disable: [ParamName.fps_only, ParamName.no_display,ParamName.preset]
    }
    ],
    toggle: {
      label: localizeStrEnum.FRAME_TIME_LABEL,
      description: localizeStrEnum.FRAME_TIME_DESCRIPTION,
      defaultEnable: true,
    },
    patchs: []
  },

  [ParamName.fps_color_change] : {
    name: ParamName.fps_color_change,
    group: ParamGroup.FPS,
    preCondition: [{
      enable: [ParamName.fps],
      disable: [ParamName.legacy_layout, ParamName.no_display, ParamName.full,ParamName.preset]
    }, {
      enable: [ParamName.legacy_layout],
      disable: [ParamName.no_display, ParamName.full,ParamName.preset]
    },{
      enable: [ParamName.fps_only],
      disable: [ParamName.legacy_layout, ParamName.no_display, ParamName.full,ParamName.preset]
    }
    ],
    toggle: {
      label: localizeStrEnum.FPS_COLOR_CHANGE_LABEL,
      description: localizeStrEnum.FPS_COLOR_CHANGE_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.show_fps_limit]:{
    name:ParamName.show_fps_limit,
    group:ParamGroup.FPS,
    preCondition:[{
      disable: [ParamName.legacy_layout,ParamName.preset,ParamName.fps_only,ParamName.no_display]
    }, {
      enable: [ParamName.legacy_layout],
      disable: [ParamName.no_display, ParamName.full,ParamName.preset,ParamName.fps_only]
    }],
    toggle:{
        label:localizeStrEnum.SHOW_FPS_LIMIT_LABEL,
        description:localizeStrEnum.SHOW_FPS_LIMIT_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },

  [ParamName.fps_limit]:{
    name:ParamName.fps_limit,
    group:ParamGroup.FPS,
    preCondition:[{
      enable: [ParamName.show_fps_limit],
    }],
    toggle:{
        label:localizeStrEnum.FPS_LIMIT_LABEL,
        description:localizeStrEnum.FPS_LIMIT_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[{
        type:ParamPatchType.slider,
        args:[0,540,1],
        defaultValue:60,
    }]
  },

  [ParamName.fps_limit_method]:{
    name:ParamName.fps_limit_method,
    group:ParamGroup.FPS,
    preCondition:[{
      enable: [ParamName.show_fps_limit],
    }],
    toggle:{
        label:localizeStrEnum.FPS_LIMIT_METHOD_LABEL,
        description:localizeStrEnum.FPS_LIMIT_METHOD_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[{
      type:ParamPatchType.dropdown,
      args:["late","early"],
      defaultValue:"late"
    }]
  },

  [ParamName.frame_timing] : {
    name: ParamName.frame_timing,
    group: ParamGroup.FPS,
    preCondition: [{
      disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.FRAME_TIMING_LABEL,
      description: localizeStrEnum.FRAME_TIMING_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.histogram] : {
    name: ParamName.histogram,
    group: ParamGroup.FPS,
    preCondition: [{
      enable: [ParamName.legacy_layout],
      disable:[ParamName.fps_only,ParamName.no_display]
    },{
      enable: [ParamName.frame_timing],
      disable:[ParamName.fps_only,ParamName.no_display]
    }],
    toggle: {
      label: localizeStrEnum.HISTOGRAM_LABEL,
      description: localizeStrEnum.HISTOGRAM_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  [ParamName.frame_count] : {
    name: ParamName.frame_count,
    group: ParamGroup.FPS,
    preCondition: [{
      disable: [ParamName.legacy_layout, ParamName.fps_only, ParamName.no_display,ParamName.preset]
    },{
      enable:[ParamName.legacy_layout],
      disable: [ParamName.full,ParamName.fps_only, ParamName.no_display,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.FRAME_COUNT_LABEL,
      description: localizeStrEnum.FRAME_COUNT_DESCRIPTION,
      defaultEnable: false,
    },
    patchs: []
  },

  
  [ParamName.debug] : {
    name: ParamName.debug,
    group: ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display,ParamName.preset]
    }],
    toggle: {
      label: localizeStrEnum.DEBUG_LABEL,
      description: localizeStrEnum.DEBUG_DESCRIPTION,
      defaultEnable: false,
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
          defaultEnable:false,
      },
      patchs:[]
  }
  */
  [ParamName.io_read]:{
      name:ParamName.io_read,
      group:ParamGroup.IO,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle:{
          label:localizeStrEnum.IO_READ_LABEL,
          description:localizeStrEnum.IO_READ_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[]
  },
  [ParamName.io_write]:{
      name:ParamName.io_write,
      group:ParamGroup.IO,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle:{
          label:localizeStrEnum.IO_WRITE_LABEL,
          description:localizeStrEnum.IO_WRITE_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[]
  },
  /*
  [ParamName.font_size]:{
      name:ParamName.font_size,
      group:ParamGroup.SETTING,
      preCondition:[{disable:[ParamName.no_display]}],
      toggle:{
          label:"font_size",
          defaultEnable:false,
      },
      patchs:[{
          type:ParamPatchType.slider,
          args:[1,40,1],
          defaultValue:[24,24,24,24,24],
      }]
  }*/
  [ParamName.arch]:{
      name:ParamName.arch,
      group:ParamGroup.OTHER,
      preCondition: [{
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
      }, {
        disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
      }],
      toggle:{
          label:localizeStrEnum.ARCH_LABEL,
          description:localizeStrEnum.ARCH_DESCRIPTION,
          defaultEnable:false,
      },
      patchs:[]
  },

  /*
  [ParamName.throttling_status]:{
    name:ParamName.throttling_status,
    group:ParamGroup.OTHER,
    preCondition:[{disable:[ParamName.no_display]}],
    toggle:{
        label:"throttling_status",
        defaultEnable:true,
    },
    patchs:[]
  },

  [ParamName.throttling_status_graph]:{
    name:ParamName.throttling_status_graph,
    group:ParamGroup.OTHER,
    preCondition:[{disable:[ParamName.no_display]}],
    toggle:{
        label:"throttling_status_graph",
        defaultEnable:true,
    },
    patchs:[]
  },
  */

  [ParamName.engine_version]:{
    name:ParamName.engine_version,
    group:ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle:{
        label:localizeStrEnum.ENGINE_VERSION_LABEL,
        description:localizeStrEnum.ENGINE_VERSION_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },

  [ParamName.gamemode]:{
    name:ParamName.gamemode,
    group:ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle:{
        label:localizeStrEnum.GAMEMODE_LABEL,
        description:localizeStrEnum.GAMEMODE_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },

  [ParamName.vkbasalt]:{
    name:ParamName.vkbasalt,
    group:ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle:{
        label:localizeStrEnum.VKBASALT_LABEL,
        description:localizeStrEnum.VKBASALT_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },

  [ParamName.resolution]:{
    name:ParamName.resolution,
    group:ParamGroup.OTHER,
    preCondition: [{
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.legacy_layout,ParamName.preset]
    }, {
      disable: [ParamName.fps_only, ParamName.no_display, ParamName.full,ParamName.preset]
    }],
    toggle:{
        label:localizeStrEnum.RESOLUTION_LABEL,
        description:localizeStrEnum.RESOLUTION_DESCRIPTION,
        defaultEnable:false,
    },
    patchs:[]
  },
  /*
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

export const steamParamDefalut:{[paramName:string]:SteamParamDefalut}[] = [
  {
    [ParamName.preset]:{enable:true,values:[0]},
    [ParamName.no_display]:{enable:true},
    [ParamName.legacy_layout]:{enable:true},
  },
  {
    [ParamName.preset]:{enable:true,values:[1]},
    [ParamName.width]:{enable:true,values:[40]},
    [ParamName.legacy_layout]:{enable:false},
    [ParamName.cpu_stats]:{enable:false,order:1},
    [ParamName.gpu_stats]:{enable:false,order:2},
    [ParamName.fps]:{enable:true,order:3},
    [ParamName.fps_only]:{enable:true},
    [ParamName.frametime]:{enable:false},
  },
  {
    [ParamName.preset]:{enable:true,values:[2]},
    [ParamName.table_columns]:{enable:true,values:[20]},
    [ParamName.horizontal]:{enable:true},
    [ParamName.legacy_layout]:{enable:false},
    [ParamName.fps]:{enable:true,order:1},
    [ParamName.frame_timing]:{enable:true,order:2},
    [ParamName.frametime]:{enable:false},
    [ParamName.cpu_stats]:{enable:true,order:3},
    [ParamName.gpu_stats]:{enable:true,order:4},
    [ParamName.ram]:{enable:true,order:5},
    [ParamName.vram]:{enable:true,order:6},
    [ParamName.battery]:{enable:true,order:7},
    [ParamName.hud_no_margin]:{enable:true},
    [ParamName.cpu_power]:{enable:true},
    [ParamName.gpu_power]:{enable:true},
    [ParamName.battery_time]:{enable:true},
    [ParamName.battery_watt]:{enable:true},
  },
  {
    [ParamName.preset]:{enable:true,values:[3]},
    [ParamName.legacy_layout]:{enable:true},
    [ParamName.cpu_temp]:{enable:true},
    [ParamName.gpu_temp]:{enable:true},
    [ParamName.ram]:{enable:true,order:1},
    [ParamName.vram]:{enable:true,order:2},
    [ParamName.cpu_power]:{enable:true},
    [ParamName.gpu_power]:{enable:true},
    [ParamName.cpu_mhz]:{enable:true},
    [ParamName.gpu_mem_clock]:{enable:true},
    [ParamName.gpu_core_clock]:{enable:true},
    [ParamName.battery]:{enable:true,order:3},
  },
  {
    [ParamName.preset]:{enable:true,values:[4]},
    [ParamName.legacy_layout]:{enable:true},
    [ParamName.full]:{enable:true},
    //[ParamName.throttling_status]:{enable:true},
    //[ParamName.throttling_status_graph]:{enable:true},
    [ParamName.io_read]:{enable:true,order:1},
    [ParamName.io_write]:{enable:true,order:2},
    [ParamName.arch]:{enable:true,order:3},
    [ParamName.engine_version]:{enable:true,order:4},
    [ParamName.battery]:{enable:true,order:5},
    [ParamName.frame_count]:{enable:true,order:6},
    [ParamName.gamemode]:{enable:true,order:7},
    [ParamName.vkbasalt]:{enable:true,order:8},
    [ParamName.show_fps_limit]:{enable:true,order:9},
    [ParamName.resolution]:{enable:true,order:10},
    [ParamName.gpu_load_change]:{enable:true},
    [ParamName.core_load_change]:{enable:true},
    [ParamName.cpu_load_change]:{enable:true},
    [ParamName.fps_color_change]:{enable:true},
  },
]
export const paramOrder:{[paramName:string]:number} = { 
  [ParamName.custom_text_center]:1,
  [ParamName.custom_text]:2,
  [ParamName.time]:2,
  [ParamName.version]:3,
  [ParamName.cpu_stats]:4,
  [ParamName.core_load]:5,
  [ParamName.gpu_stats]:6,
  [ParamName.io_read]:7,
  [ParamName.io_write]:8,
  [ParamName.vram]:9,
  [ParamName.ram]:10,
  [ParamName.procmem]:11,
  [ParamName.battery]:12,
  [ParamName.fan]:13,
  [ParamName.fsr]:14,
  [ParamName.fps]:15,
  [ParamName.frame_timing]:16,
  [ParamName.frame_count]:17,
  [ParamName.debug]:18,
  [ParamName.arch]:19,
  [ParamName.engine_version]:20,
  [ParamName.gamemode]:21,
  [ParamName.vkbasalt]:22,
  [ParamName.show_fps_limit]:23,
  [ParamName.resolution]:24,
  [ParamName.graphs_cpu_load]:25,
  [ParamName.graphs_cpu_temp]:26,
  [ParamName.graphs_gpu_core_clock]:27,
  [ParamName.graphs_gpu_load]:28,
  [ParamName.graphs_gpu_mem_clock]:29,
  [ParamName.graphs_gpu_temp]:30,
  [ParamName.graphs_ram]:31,
  [ParamName.graphs_vram]:32,
}