export enum ParamName{
    alpha="alpha",
    background_alpha="background_alpha",
    battery="battery",
    battery_icon="battery_icon",
    cpu_stats="cpu_stats",
    core_load="core_load",
    core_load_change="core_load_change",
    cpu_load_change="cpu_load_change",
    cpu_mhz="cpu_mhz",
    cpu_power="cpu_power",
    cpu_temp="cpu_temp",
    cpu_text="cpu_text",
    gpu_stats="gpu_stats",
    gpu_load_change="gpu_load_change",
    gpu_core_clock="gpu_core_clock",
    gpu_power="gpu_power",
    gpu_temp="gpu_temp",
    gpu_text="gpu_text",
    frame_timing="frame_timing",
    legacy_layout="legacy_layout",
    width="width",
    offset_x="offset_x",
    offset_y="offset_y",
    fsr="fsr",
    ram="ram",
    vram="vram",
    swap="swap",
    position="position",
    fps="fps",
    fps_only="fps_only",
    fan="fan",
}

export enum ParamGroup{
    LAYOUT="LAYOUT",
    SETTING="SETTING",
    CPU="CPU",
    GPU="GPU",
    RAM="RAM",
    BATT="BATT",
    OTHER="OTHER",

}

export enum ParamPatchType{
    dropdown="dropdown",
    slider="slider",
    notchSlider="notchSlider",
    textInput="textInput",
    none="none"
}

export enum UpdateType{
    DISABLE="DISABLE",
    UPDATE="UPDATE",
    HIDE="HIDE",
    SHOW="SHOW",
    ENABLE="ENABLE",
    DISMOUNT="DISMOUNT"
}

export enum PluginState{
    INIT="0",
    RUN="1",
    QUIT="2",
  }