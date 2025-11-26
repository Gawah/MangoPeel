import { JsonObject, JsonProperty, JsonSerializer } from 'typescript-json-serializer';
import { Backend } from './backend';
import { Config } from './config';
import { ParamGroup, ParamName, ParamPatchType} from './enum';
import { prefStore } from './perfStore';
import { Router } from '@decky/ui';
import { AppOverviewExt } from './interface';

const SETTINGS_KEY = "MangoPeel";
const serializer = new JsonSerializer();

type ActiveAppChangedHandler = (newAppId: string, oldAppId: string) => void;
type UnregisterFn = () => void;
export const DEFAULT_APP = "0";
export class RunningApps {
  private static listeners: ActiveAppChangedHandler[] = [];
  private static lastAppId: string = DEFAULT_APP;
  private static intervalId: any;

  private static pollActive() {
    const newApp = RunningApps.active();
    if (this.lastAppId != newApp) {
      this.listeners.forEach((h) => h(newApp, this.lastAppId));
    }
    this.lastAppId = newApp;
  }

  static register() {
    if (this.intervalId == undefined)
      this.intervalId = setInterval(() => this.pollActive(), 100);
  }

  static unregister() {
    if (this.intervalId != undefined)
      clearInterval(this.intervalId);

    this.listeners.splice(0, this.listeners.length);
  }

  static listenActiveChange(fn: ActiveAppChangedHandler): UnregisterFn {
    const idx = this.listeners.push(fn) - 1;
    return () => {
      this.listeners.splice(idx, 1);
    };
  }

  static active() {
    return Router.MainRunningApp?.appid || DEFAULT_APP;
  }

  static active_appInfo() {
    return Router.MainRunningApp as unknown as AppOverviewExt || null;
  }
}

@JsonObject()
export class ParamInfo {
  @JsonProperty()
  public paramName: string;
  @JsonProperty()
  public paramOrder:number;
  @JsonProperty()
  public bEnable: boolean;
  public bVisible: boolean;
  @JsonProperty()
  public paramValues!: any[];  //某些参数可能包含多个值
  constructor(paramName: string, bEnable: boolean, paramValue: any[],paramOrder: number) {
    this.paramName = paramName;
    this.bEnable = bEnable;
    this.bVisible = true;
    this.paramOrder = paramOrder;
    this.paramValues = paramValue?.concat();
  }

  public copyParamInfo(newParamInfo: ParamInfo) {
    this.paramName = newParamInfo.paramName;
    this.bEnable = newParamInfo.bEnable;
    this.bVisible = newParamInfo.bVisible;
    this.paramOrder = newParamInfo.paramOrder;
    this.paramValues = newParamInfo.paramValues?.concat();
  }

}

@JsonObject()
export class ParamSetting {
  @JsonProperty({ dataStructure: "dictionary", type: ParamInfo })
  public paramMap: Record<string, ParamInfo> = {};

  public getParamEnable(paramName: ParamName) {
    return this.paramMap[paramName]?.bEnable??false;
  }
  public setParamEnable(paramName: ParamName, bEnable: boolean) {
    if(paramName in this.paramMap){
      this.paramMap[paramName]!.bEnable = bEnable;
    }
  }

  public getParamValues(paramName: ParamName) {
    return this.paramMap[paramName]?.paramValues??[];
  }
  public setParamValues(paramName: ParamName, paramValue: any[]) {
    if(paramName in this.paramMap){
      this.paramMap[paramName]!.paramValues = paramValue?.concat();
    }
  }

  public getParamVisible(paramName: ParamName) {
    return this.paramMap[paramName]?.bVisible??false;
  }
  public setParamVisible(paramName: ParamName, visible: boolean) {
    if(paramName in this.paramMap){
      this.paramMap[paramName]!.bVisible = visible;
    }
  }

  public getParamOrder(paramName: ParamName) {
    return this.paramMap[paramName]?.paramOrder??0;
  }
  public setParamOrder(paramName: ParamName, paramOrder: number) {
    if(paramName in this.paramMap){
      //console.log(`name= ${paramName} nowOrder = ${this.paramMap[paramName]!.paramOrder} setOrder = ${paramOrder}`);
      //参与排序的参数不可设置为0
      if (this.paramMap[paramName]!.paramOrder !=0 && paramOrder == 0){
        return;
      }
      this.paramMap[paramName]!.paramOrder = paramOrder;
    }
  }

  public getParamWork(paramName: ParamName) {
    const paramEnable = this.getParamEnable(paramName);
    const paramVisible = this.getParamVisible(paramName);
    return paramVisible && paramEnable;
  }

  //拷贝另一个配置
  public copyParamSettings(newSetting: ParamSetting) {
    for (const name of Object.keys(this.paramMap)) {
      if (name in newSetting.paramMap) {
        this.setParamEnable(name as ParamName, newSetting.getParamEnable(name as ParamName));
        this.setParamValues(name as ParamName, newSetting.getParamValues(name as ParamName));
        this.setParamOrder(name as ParamName, newSetting.getParamOrder(name as ParamName));
      }
    }
  }

  //转换为mangoapp的配置字符串格式
  public toMangoConfig() {
    let config = "";
    //参数排序规则，order越小越靠前，0代表该参数先后顺序不影响效果，放置到后面
    const paramReSort = (a: ParamInfo, b: ParamInfo) => {
      const aParamOrder = this.getParamOrder(a.paramName as ParamName);
      const bParamOrder = this.getParamOrder(b.paramName as ParamName);
      if(aParamOrder == 0||bParamOrder == 0){
        return bParamOrder - aParamOrder;
      }
      return aParamOrder - bParamOrder;
    }
    //排序后针对每个参数一一转换
    for (const paramInfo of Object.values(this.paramMap).sort(paramReSort)) {
      if (this.getParamWork(paramInfo.paramName as ParamName)) {
        //图表类参数需要特殊处理
        if(paramInfo.paramName.startsWith("graphs_")){
          config += `graphs=${paramInfo.paramName.substring("graphs_".length)}`
        }else{
          config += paramInfo.paramName;
        }
        const valueList = this.getParamValues(paramInfo.paramName as ParamName);
        if (valueList.length > 0) {
          switch (paramInfo.paramName) {
            case ParamName.legacy_layout:
              config += `=1`;
              break;
            default:
              config += "=";
              for (const [index, value] of valueList.entries()) {
                if (index != 0) {
                  config += ",";
                }
                config += `${value}`;
              }
              break;
          }
        }
        config += "\n";
      }
      //一些特殊的参数 未开启时也要写入param=xxx
      else{
        if((this.getParamWork(ParamName.preset))){
          continue;
        }
        switch (paramInfo.paramName) {
          case ParamName.legacy_layout:
            config += `${ParamName.legacy_layout}=0\n`;
            break;
          case ParamName.frametime:
            config += `${ParamName.frametime}=0\n`;
            break;
          case ParamName.text_outline_thickness:
            config += `${ParamName.text_outline_thickness}=0\n`;
            break;
        }
      }
    }
    return config;
  }
}

@JsonObject()
export class perAppSetting{
  @JsonProperty()
  overwrite?:boolean = false;
  @JsonProperty()
  index?:number = 0;

  constructor(overwrite?:boolean,index?:number){
    this.overwrite=overwrite??false;
    this.index=index??0;
  }
  deepCopy(copyTarget:perAppSetting){
    this.overwrite=copyTarget.overwrite;
    this.index = copyTarget.index;
  }
}


@JsonObject()
export class Settings {
  private static _instance = new Settings();
  private static _steamIndex = -1;
  private static _dependencyGraph: Record<string, string[]>[] = [];
  public static settingChangeEventBus = new EventTarget();
  
  @JsonProperty()
  public enabled = true;
  @JsonProperty()
  public currentTabRoute: string = "";
  @JsonProperty({ dataStructure: "dictionary", type: ParamSetting })
  public paramSettings: Record<number, ParamSetting> = {};
  @JsonProperty({dataStructure: "dictionary", type: perAppSetting })
  public perAppSetting: { [appId: string]: perAppSetting} = {};

  public static overlayLevelUpdate(number:number){
    //设置不同且perfstore可以进行设置
    if(number!=Settings._steamIndex){
        //prefStore.setSteamIndex(number);
        Settings.setSettingsIndex(number);
    }
  }

  public static async init(): Promise<void> {
    RunningApps.register();
    //初始化设置
    this.initSettingsFromConfig();
    //加载保存值（支持自动迁移）
    await this.loadSettingsFromStorage();
    //初始下标
    var trySetResult = await prefStore.trySetSteamIndex(this.perAppIndex(),10);
    if(trySetResult){
      Settings.setSettingsIndex(this.perAppIndex());
    }else{
      await Backend.getSteamIndex().then((nowIndex)=>{
        this._steamIndex=nowIndex;
      });
    }

    //监听数值变化
    prefStore.registerOverlayLevelListener(this.overlayLevelUpdate);

    //切换app时，更换设置
    RunningApps.listenActiveChange((_newAppId,_oldAppId)=>{
      var perAppIndex=this.perAppIndex();
      this.overlayLevelUpdate(perAppIndex);
      prefStore.trySetSteamIndex(perAppIndex,10);
    })
  }

  public static async unregister(): Promise<void> {
    RunningApps.unregister();
    prefStore.removeOverlayLevelListener(this.overlayLevelUpdate);
  }

  //获取当前配置文件
  public static ensurePerAppSetting(): perAppSetting {
    const appId = RunningApps.active(); 
    //没有配置文件的时候新生成一个
    if (!(appId in this._instance.perAppSetting)) {
      //创建一个perapp配置文件
      this._instance.perAppSetting[appId]=new perAppSetting();
      if(!(DEFAULT_APP in this._instance.perAppSetting)){
        //创建一个默认配置文件
        this._instance.perAppSetting[DEFAULT_APP]=new perAppSetting();
        this._instance.perAppSetting[DEFAULT_APP].overwrite=false;
        this._instance.perAppSetting[DEFAULT_APP].index=this._steamIndex;
      }
      this._instance.perAppSetting[appId].deepCopy(this._instance.perAppSetting[DEFAULT_APP]);  
    }
    //如果未开启覆盖，则使用默认配置文件
    if(!this._instance.perAppSetting[appId].overwrite){
      return this._instance.perAppSetting[DEFAULT_APP];
    }
    //使用appID配置文件
    return this._instance.perAppSetting[appId];
  }

  public static perAppOverWrite():boolean {
    if(RunningApps.active()==DEFAULT_APP){
      return false;
    }
    return Settings.ensurePerAppSetting().overwrite!!;
  }

  public static perAppIndex():number {
    return Settings.ensurePerAppSetting().index!!;
  }

  public static setPerAppIndex(index:number){
    if(this.perAppIndex()!=index){
      this.ensurePerAppSetting().index=index;
      Settings.saveSettingsToStorage();
    }
  }

  public static setPerAppOverWrite(overwrite:boolean){
    if(RunningApps.active()!=DEFAULT_APP&&this.perAppOverWrite()!=overwrite){
      this._instance.perAppSetting[RunningApps.active()].overwrite=overwrite;
      var perAppIndex=this.perAppIndex();
      //如果关闭后的index发生了变化，则进行切换
      if(perAppIndex!=this._steamIndex&&prefStore.getSteamIndex()!=-1){
        prefStore.setSteamIndex(perAppIndex);
        Settings.setSettingsIndex(perAppIndex);
      }
      Settings.saveSettingsToStorage();
    }
  }

  /*
  //插件是否开启
  public static getEnable(): boolean {
    return this._instance.enabled;
  }

  //设置开启关闭
  public static setEnable(enabled: boolean) {
    if (this._instance.enabled !== enabled) {
      this._instance.enabled = enabled;
      Settings.saveSettingsToLocalStorage();
    }
  }
  */

  //获取该参数的依赖关系
  public static getDependence(index:number,paramName:ParamName,){
    if(!(index in this._dependencyGraph)){
      this._dependencyGraph[index] = {} as Record<string, string[]>
    }
    if(paramName in this._dependencyGraph[index]){
      return this._dependencyGraph[index][paramName];
    }
    var dependenceList=Object.values(Config.paramList).filter((paramData) => {
      var bmatch = false;
      paramData.preCondition?.forEach((targetState)=>{
          targetState.enable?.forEach(name => {
            if(paramName==name)
              bmatch=true;
          });
          targetState.disable?.forEach(name=>{
            if(paramName==name)
              bmatch=true;
          })
      });
      return bmatch;
    }).map((paramData)=>{
      return paramData.name;
    });
    this._dependencyGraph[index][paramName]=dependenceList;
    return this._dependencyGraph[index][paramName];
  }

  //获取指定下标对应配置文件，默认为当前下标
  public static getSettings(index:number): ParamSetting {
    return this._instance.paramSettings[index??this._steamIndex];
  }

  public static getSettingsIndex():number{
    return this._steamIndex;
  }

  public static getCurrentTabRoute(): string {
    return this._instance.currentTabRoute || "";
  }

  public static setCurrentTabRoute(route: string) {
    if (this._instance.currentTabRoute !== route) {
      this._instance.currentTabRoute = route;
      this.saveSettingsToStorage();
    }
  }

  public static setSettingsIndex(index:number){
    if(this._steamIndex!=index){
      this._steamIndex=index;
      this.setPerAppIndex(index);
      //延迟1帧刷新，防止一些逻辑还没跑完就刷新界面
      setTimeout(() => {
        //刷新整个界面
        for (const data of Object.values(Config.paramList)) {
          this.updateParamVisible(index,data.name as ParamName);
          this.settingChangeEventBus.dispatchEvent(new Event(data.name));
        }
        //刷新组标题
        for(var groupName in ParamGroup){
          this.settingChangeEventBus.dispatchEvent(new Event(groupName));
        }
      }, 0);
    }
  }

  public static getParamEnable(index:number,paramName:ParamName){
    return this.getSettings(index).getParamEnable(paramName);
  }
  public static setParamEnable(index:number,paramName:ParamName,bEnable:boolean){
    if(bEnable!=this.getParamEnable(index,paramName)){
      this.getSettings(index).setParamEnable(paramName,bEnable);
      var updateParamList=this.updateParamVisible(index,paramName);
      var updateGroupList:ParamGroup[]=[];
      //刷新前置参数包含此参数的组件
      updateParamList.forEach((paramName)=>{
        //刷新组件
        this.settingChangeEventBus.dispatchEvent(new Event(paramName));
        if(updateGroupList.indexOf(Config.paramList[paramName].group)==-1){
          updateGroupList.push(Config.paramList[paramName].group);
        }
      })
      //刷新对应的参数组标题
      updateGroupList.forEach((groupName)=>{
        this.settingChangeEventBus.dispatchEvent(new Event(groupName));
      })
      //刷新排序信息
      if(this.getSettings(index).getParamOrder(paramName)>0){
        this.settingChangeEventBus.dispatchEvent(new Event(ParamName.legacy_layout));
      }
      Settings.saveSettingsToStorage();
      Backend.applyConfig(index,this.toMangoConfig(index));
    }
  }

  public static getParamValue(index:number,paramName:ParamName,patchIndex:number){
    var paramValues=this.getSettings(index).getParamValues(paramName);
    //参数值无效时，重设置为默认值
    if(!this.isValidParamValue(index,paramValues,paramName,patchIndex)){
      //paramValues=this.getDefaultParam(index,paramName,this.getSettingsIndex()).paramValues;
      this.getSettings(index).setParamValues(paramName,paramValues);
    }
    return paramValues[patchIndex];
  }

  public static setParamValue(index:number,paramName:ParamName,patchIndex:number,paramValue:any){
    var paramValues=this.getSettings(index).getParamValues(paramName);
    if(patchIndex>=paramValues.length){
      paramValues=this.getDefaultParam(index,paramName).paramValues;
    }
    if(patchIndex>=0&&patchIndex<paramValues.length&&paramValue!=paramValues[patchIndex]){
      paramValues[patchIndex]=paramValue;
      this.getSettings(index).setParamValues(paramName,paramValues);
      Settings.saveSettingsToStorage();
      Backend.applyConfig(index,this.toMangoConfig(index));
      //this.settingChangeEventBus.dispatchEvent(new Event(paramName))
    }
  }

  public static getParamWork(index:number,paramName:ParamName){
    return this.getSettings(index).getParamWork(paramName);
  }

  public static getParamVisible(index:number,paramName:ParamName){
    return this.getSettings(index).getParamVisible(paramName);
  }

  public static updateParamVisible(index:number,paramName:ParamName){
    function topologicalOrderDFS(paramName:ParamName,index:number,onVisited:ParamName[],onUpdated:ParamName[]){
      if(onVisited.indexOf(paramName)!=-1){
        console.error(`存在循环依赖 paramName=${paramName} onVisited:${onVisited}`);
        return [];
      }
      onVisited.push(paramName);
      var paramVisible=false;
      //未配置前置参数时默认可见
      if(Config.paramList[paramName]?.preCondition==undefined||Config.paramList[paramName]?.preCondition?.length==0){
        paramVisible=true;
      }else{
        //配置前置参数时，有一组满足条件即为可见
        for(var targetState of Config.paramList[paramName].preCondition!){
          paramVisible=true;
          targetState.enable?.forEach(name => {
            var paramEnable=Settings.getParamWork(index,name);
            if(paramEnable!=true)
              paramVisible=false;
          });
          targetState.disable?.forEach(name => {
            var paramEnable=Settings.getParamWork(index,name);
            if(paramEnable!=false)
              paramVisible=false;
          });
          if(paramVisible)
            break;
        }
      }
      if(onUpdated.indexOf(paramName)==-1){
        onUpdated.push(paramName);
      }
      Settings.getSettings(index).setParamVisible(paramName,paramVisible);
      var updateList=Settings.getDependence(index,paramName);
      for(var neighbor of updateList){
        topologicalOrderDFS(neighbor as ParamName,index,onVisited,onUpdated);
      }
      onVisited.splice(onVisited.indexOf(paramName),1);
      return onUpdated;
    }
    return topologicalOrderDFS(paramName,index,[],[]);
  }

  public static getGroupVisible(index:number,groupName:ParamGroup){
    return Object.entries(Config.paramList).filter(([_paramName,paramData])=>{
        return paramData.group==groupName&&this.getParamVisible(index,paramData.name);
      }).length > 0;
  }

  //重置所有参数的默认值
  public static resetAllParamDefault(){
    var index = this.getSettingsIndex();
    Object.entries(Config.paramList).map(([paramName,paramData]) => {
      var defaultParam = this.getDefaultParam(index,paramName as ParamName);
      this.getSettings(index).setParamValues(paramName as ParamName,defaultParam.paramValues);
      this.getSettings(index).setParamEnable(paramName as ParamName,defaultParam.bEnable);
      this.getSettings(index).setParamOrder(paramName as ParamName,defaultParam.paramOrder);
      this.updateParamVisible(index,paramName as ParamName);
      this.settingChangeEventBus.dispatchEvent(new Event(paramName));
      this.settingChangeEventBus.dispatchEvent(new Event(paramData.group));
      //console.log(`defaultParam: name=${defaultParam.paramName} enable=${defaultParam.bEnable} value=${defaultParam.paramValues} nowvalue=${this.getSettings().getParamValues(paramName as ParamName)} order=${defaultParam.paramOrder}`)
    })
    Settings.saveSettingsToStorage();
    Backend.applyConfig(index,this.toMangoConfig(index));
  }

  //重置单一参数的默认值
  public static resetParamValueDefault(index:number,paramName:ParamName,patchIndex:number){
    var defaultParam = this.getDefaultParam(index,paramName);
    this.setParamValue(index,paramName,patchIndex,defaultParam.paramValues[patchIndex])
    this.updateParamVisible(index,paramName as ParamName);
    this.settingChangeEventBus.dispatchEvent(new Event(paramName));
  }

  
  //获取参数配置的默认值
  public static getDefaultParam(index:number,paramName:ParamName){
    //查找steam是否配置了默认值
    if(index>=0&&index<Config.steamParamDefault.length&&paramName in Config.steamParamDefault[index]){
      return new ParamInfo(paramName,Config.steamParamDefault[index][paramName].enable,Config.steamParamDefault[index][paramName].values??[],Config.steamParamDefault[index][paramName].order??0);
    }
    //查找插件配置的默认值
    if(paramName in Config.paramList){
      return new ParamInfo(paramName,Config.paramList[paramName].toggle.defaultEnable,Config.paramList[paramName].patchs.map((value)=>{
        return value.defaultValue??[];
      }),Config.paramOrder[paramName]??0);
    }
    else{
      console.error(`参数${paramName}未找到默认值配置`);
      return new ParamInfo(paramName,false,[],0);
    }
  }

  //获取配置转化mango格式
  public static toMangoConfig(index:number){
    return this.getSettings(index).toMangoConfig()??""
  }

  //获取所有配置转化mango格式
  public static toMangoConfigs(){
    var configs:string[]=[];
    for(var index = 0;index<5;index++) {
      var config = this.getSettings(index).toMangoConfig()
      configs.push(config);
      console.debug(`getConfigs index = ${index} config=${config}`);
    }
    return configs;
  }

  //判断是否为合法的参数值
  public static isValidParamValue(index:number,paramValues:any,paramName:ParamName,patchIndex:number){
    var defaultValues=this.getDefaultParam(index,paramName).paramValues;
    //长度和配置的默认值不一致，判定不合法
    if(paramValues.length!=defaultValues.length){
      return false;
    }
    var paramValue=paramValues[patchIndex];
    var paramPatch = Config.paramList[paramName]?.patchs?.[patchIndex];
    if(paramValue==null)
      return false;
    //判断是否在config.ts里面配置过这个参数
    if(!paramPatch)
      return false;
    //判断取到的param值是否在config.ts配置的参数范围内
    switch(paramPatch.type){
      case(ParamPatchType.dropdown):
        if(paramPatch.args.indexOf(paramValue) == -1){
          return false;
        }
        break;
      case(ParamPatchType.slider):
        var min = paramPatch.args[0];
        var max = paramPatch.args[1];
        if(paramValue<min||paramValue>max)
          return false;
        break;
      case(ParamPatchType.notchSlider):
        if(paramPatch.args.indexOf(paramValue) == -1){
          return false;
        }
        break;
      case(ParamPatchType.textInput):
        break;
      case(ParamPatchType.resortableList):
        break;
      case(ParamPatchType.none):
        return false;
    }
    return true;
  }

  //获取排序参数列表
  public static getSortParamList(index:number){
    //参数排序规则，order越小越靠前，0代表该参数先后顺序不影响效果，放置到后面
    const paramReSort = (a: ParamInfo, b: ParamInfo) => {
      const aParamOrder = this.getSettings(index).getParamOrder(a.paramName as ParamName);
      const bParamOrder = this.getSettings(index).getParamOrder(b.paramName as ParamName);
      return aParamOrder - bParamOrder;
    }
    return Object.values(this.getSettings(index).paramMap).filter((paramInfo)=>{
      return paramInfo.paramOrder!=0 && this.getParamWork(index,paramInfo.paramName as ParamName)
    }).sort(paramReSort).map((value)=>{
      return Config.paramList[value.paramName];
    })
  }

  //获取当前生效的排序参数个数
  public static getSortParamCount(index:number){
    return Object.values(this.getSettings(index).paramMap).filter((paramInfo)=>{
      return paramInfo.paramOrder!=0 && this.getParamWork(index,paramInfo.paramName as ParamName)
    }).length;
  }

  //设置排序参数列表
  public static setParamOrder(index:number,paramName:ParamName,order:number){
    var paramOrder=this.getSettings(index).getParamOrder(paramName);
    if(order!=paramOrder){
      this.getSettings(index).setParamOrder(paramName,order);
      Settings.saveSettingsToStorage();
      Backend.applyConfig(index,this.toMangoConfig(index));
      //this.settingChangeEventBus.dispatchEvent(new Event(paramName))
    }
  }

  //根据config配置进行初始化
  public static initSettingsFromConfig(){
    for(var index=0;index<5;index++){
      if(!(index in this._instance.paramSettings)){
        this._instance.paramSettings[index]=new ParamSetting();
      }
      //初始化默认值
      for (const data of Object.values(Config.paramList)) {
        this._instance.paramSettings[index].paramMap[data.name]=this.getDefaultParam(index,data.name);
      }
      //更新可见性
      for (const data of Object.values(Config.paramList)) {
        this.updateParamVisible(index,data.name);
      }
    }
  }

  // 改为私有方法，仅用于数据迁移
  private static loadSettingsFromLocalStorage() {
    try {
      const settingsString = localStorage.getItem(SETTINGS_KEY);
      if (!settingsString || settingsString === "{}") {
        return null;
      }
      const settingsJson = JSON.parse(settingsString);
      return serializer.deserializeObject(settingsJson, Settings);
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return null;
    }
  }

  // 新方法：从后端加载配置（支持自动迁移）
  public static async loadSettingsFromStorage() {
    try {
      // 1. 先从后端读取
      const settingsJson = await Backend.getSettings();
      let loadSetting = null;

      if (!settingsJson || Object.keys(settingsJson).length === 0) {
        // 2. 后端无数据，检查 localStorage 旧数据
        console.log("[MangoPeel] No backend data, checking localStorage...");
        loadSetting = this.loadSettingsFromLocalStorage();
        
        if (loadSetting) {
          console.log("[MangoPeel] Found localStorage data, migrating...");
          // 迁移到后端
          const settingsJson = serializer.serializeObject(loadSetting);
          await Backend.setSettings(settingsJson);
          console.log("[MangoPeel] Migration completed");
        } else {
          console.log("[MangoPeel] No saved settings, using defaults");
          return;
        }
      } else {
        // 3. 后端有数据，直接反序列化
        loadSetting = serializer.deserializeObject(settingsJson, Settings);
        console.log("[MangoPeel] Loaded settings from backend");
      }

      // 4. 应用配置
      if (loadSetting) {
        this._instance.enabled = loadSetting?.enabled ?? false;
        this._instance.currentTabRoute = loadSetting?.currentTabRoute ?? "";
        this._instance.perAppSetting = loadSetting?.perAppSetting ?? {
          DEFAULT_APP: new perAppSetting(
            false,
            prefStore.getSteamIndex() == -1 ? 4 : prefStore.getSteamIndex()
          )
        };
        
        for (var index = 0; index < 5; index++) {
          if (loadSetting?.paramSettings?.[index]) {
            this._instance.paramSettings[index].copyParamSettings(
              loadSetting.paramSettings[index]
            );
          }
          for (const data of Object.values(Config.paramList)) {
            this.updateParamVisible(index, data.name);
          }
        }
      }
    } catch (error) {
      console.error("[MangoPeel] Failed to load settings:", error);
    }
  }

  // 重命名并改为异步方法
  public static async saveSettingsToStorage() {
    try {
      const settingsJson = serializer.serializeObject(this._instance);
      await Backend.setSettings(settingsJson);
    } catch (error) {
      console.error("[MangoPeel] Failed to save settings:", error);
    }
  }

}
