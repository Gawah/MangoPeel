import { JsonObject, JsonProperty, JsonSerializer } from 'typescript-json-serializer';
import { Backend } from './backend';
import { paramList } from './config';
import { ParamGroup, ParamName, ParamPatchType} from './enum';
import { ParamData } from './interface';

const SETTINGS_KEY = "MangoPeel";
const serializer = new JsonSerializer();

@JsonObject()
export class ParamInfo {
  @JsonProperty()
  public paramName: string;
  @JsonProperty()
  public bEnable: boolean;
  @JsonProperty()
  public bVisible: boolean;
  @JsonProperty()
  public paramValues!: any[];  //某些参数可能包含多个值
  constructor(paramName: string, bEnable: boolean, paramValue: any[]) {
    this.paramName = paramName;
    this.bEnable = bEnable;
    this.bVisible = true;
    this.setParamValues(paramValue);
  }
  public setParamValues(paramValue: any[]) {
    this.paramValues = paramValue?.concat();
  }
}

@JsonObject()
export class ParamSetting {
  @JsonProperty({ isDictionary: true, type: ParamInfo })
  public paramMap: Record<string, ParamInfo | undefined> = {};
  //初始化所有参数
  public initParamSetting(defaultIndex: number) {
    //参数集中没有数据时给个默认值
    for (const paramName of Object.values(ParamName)) {
      if (!this.paramMap[paramName]) {
        this.paramMap[paramName] = new ParamInfo(
          paramName,
          this.getParamEnableDefault(paramName, defaultIndex),
          this.getParamValueDefault(paramName, defaultIndex),
        );
      }
    }
  }
  //拷贝另一个配置
  public copyParamSettings(newSetting: ParamSetting) {
    for (const name of Object.keys(this.paramMap)) {
      if (name in newSetting.paramMap) {
        this.setParamEnable(name as ParamName, newSetting.getParamEnable(name as ParamName));
        this.setParamValues(name as ParamName, newSetting.getParamValues(name as ParamName));
      }
    }
  }
  public setParamEnable(paramName: ParamName, bEnable: boolean) {
    this.paramMap[paramName]!.bEnable = bEnable;
  }
  public getParamEnable(paramName: ParamName) {
    return this.paramMap[paramName]!.bEnable;
  }
  public setParamValues(paramName: ParamName, paramValue: any[]) {
    this.paramMap[paramName]!.setParamValues(paramValue);
  }

  public getParamValues(paramName: ParamName) {
    return this.paramMap[paramName]!.paramValues ?? [];
  }

  public getParamVisible(paramName: ParamName) {
    return this.paramMap[paramName]!.bVisible;
  }

  public setParamVisible(paramName: ParamName, visible: boolean) {
    this.paramMap[paramName]!.bVisible = visible;
  }

  public getParamEnableDefault(paramName: ParamName, defaultIndex: number) {
    return paramList[paramName]?.toggle.defaultEnable[defaultIndex];
  }

  public getParamValueDefault(paramName: ParamName, defaultIndex: number) {
    return paramList[paramName]?.patchs.map((value) => {
      return value.defaultValue[defaultIndex];
    })
  }

  public getParamWork(paramName: ParamName) {
    const paramEnable = this.getParamEnable(paramName);
    const paramVisible = this.getParamVisible(paramName);
    return paramVisible && paramEnable;
  }

  public toMangoConfig() {
    let config = "";
    const paramOrderList = this.getParamValues(ParamName.legacy_layout)?.[0] ?? [];
    const paramReSort = (a: [string, ParamData], b: [string, ParamData]) => {
      const aParamOrder = paramOrderList.indexOf(a[1].name);
      const bParamOrder = paramOrderList.indexOf(b[1].name);
      return aParamOrder - bParamOrder;
    }
    for (const [_name, paramData] of Object.entries(paramList).sort(paramReSort)) {
      if (this.getParamWork(paramData.name)) {
        config += paramData.name;
        const valueList = this.getParamValues(paramData.name);
        if (valueList.length > 0) {
          switch (paramData.name) {
            case ParamName.legacy_layout:
              config += `${ParamName.legacy_layout}=1\n`;
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
      else {
        switch (paramData.name) {
          case ParamName.legacy_layout:
            config += `${ParamName.legacy_layout}=0\n`;
            break;
          case ParamName.frametime:
            config += `${ParamName.frametime}=0\n`;
            break;
        }
      }
    }
    return config;
  }
}

@JsonObject()
export class Settings {
  private static _instance = new Settings();
  private static _steamIndex = -1;
  public static dependencyGraph: Record<string, string[]> = {};
  public static settingChangeEventBus = new EventTarget();
  @JsonProperty()
  public enabled = true;
  @JsonProperty({ isDictionary: true, type: ParamSetting })
  public paramSettings: Record<number, ParamSetting> = {};

  public static async init(): Promise<void> {
    //加载保存值
    this.loadSettingsFromLocalStorage();
    //初始下标0
    this.setSettingsIndex(0);
  }

  //插件是否开启
  public static ensureEnable(): boolean {
    return this._instance.enabled;
  }

  //设置开启关闭
  public static setEnable(enabled: boolean) {
    if (this._instance.enabled !== enabled) {
      this._instance.enabled = enabled;
      Settings.saveSettingsToLocalStorage();
    }
  }

  public static ensureDependence(paramName:ParamName){
    if(this.dependencyGraph[paramName])
      return this.dependencyGraph[paramName];
    var dependenceList=Object.values(paramList).filter((paramData) => {
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
    this.dependencyGraph[paramName]=dependenceList;
    return this.dependencyGraph[paramName];
  }

  //获取指定下标对应配置文件，默认为当前下标
  public static ensureSettings(index?:number): ParamSetting {
    return this._instance.paramSettings[index??this._steamIndex];
  }

  public static getSettingsIndex():number{
    return this._steamIndex;
  }

  public static setSettingsIndex(index:number){
    if(this._steamIndex!=index){
      this._steamIndex=index;
      //刷新整个界面
      for(var paramName in ParamName){
        this.settingChangeEventBus.dispatchEvent(new Event(paramName));
        this.updateParamVisible(paramName as ParamName);
      }
      for(var groupName in ParamGroup){
        this.settingChangeEventBus.dispatchEvent(new Event(groupName));
      }
    }
  }

  public static setParamEnable(paramName:ParamName,bEnable:boolean,bforce?:boolean){
    if(bEnable!=this.getParamEnable(paramName)||(bforce??false)){
      this.ensureSettings().setParamEnable(paramName,bEnable);
      var updateParamList=this.updateParamVisible(paramName);
      var updateGroupList:ParamGroup[]=[];
      //刷新前置参数包含此参数的组件
      updateParamList.forEach((paramName)=>{
        //刷新组件
        this.settingChangeEventBus.dispatchEvent(new Event(paramName));
        if(updateGroupList.indexOf(paramList[paramName].group)==-1){
          updateGroupList.push(paramList[paramName].group);
        }
      })
      //刷新对应的参数组标题
      updateGroupList.forEach((groupName)=>{
        this.settingChangeEventBus.dispatchEvent(new Event(groupName));
      })
      Settings.saveSettingsToLocalStorage();
      Backend.applyConfig(this.getSettingsIndex(),this.getParamConfig());
    }
  }

  public static getParamWork(paramName:ParamName){
    return this.ensureSettings().getParamWork(paramName);
  }

  public static getParamEnable(paramName:ParamName){
    return this.ensureSettings().getParamEnable(paramName);
  }

  public static getParamVisible(paramName:ParamName){
    return this.ensureSettings().getParamVisible(paramName);
  }

  public static updateParamVisible(paramName:ParamName){
    function topologicalOrderDFS(paramName:ParamName,onVisited:ParamName[],onUpdated:ParamName[]){
      if(onVisited.indexOf(paramName)!=-1){
        console.error(`存在循环依赖 paramName=${paramName} onVisited:${onVisited}`);
        return [];
      }
      onVisited.push(paramName);
      var paramVisible=false;
      //未配置前置参数时默认可见
      if(paramList[paramName].preCondition==undefined||paramList[paramName].preCondition?.length==0){
        paramVisible=true;
      }else{
        //配置前置参数时，有一组满足条件即为可见
        for(var targetState of paramList[paramName].preCondition!){
          paramVisible=true;
          targetState.enable?.forEach(name => {
            var paramEnable=Settings.getParamWork(name);
            if(paramEnable!=true)
              paramVisible=false;
          });
          targetState.disable?.forEach(name => {
            var paramEnable=Settings.getParamWork(name);
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
      Settings.ensureSettings().setParamVisible(paramName,paramVisible);
      var updateList=Settings.ensureDependence(paramName);
      for(var neighbor of updateList){
        topologicalOrderDFS(neighbor as ParamName,onVisited,onUpdated);
      }
      onVisited.splice(onVisited.indexOf(paramName),1);
      return onUpdated;
    }
    return topologicalOrderDFS(paramName,[],[]);
  }


  public static getGroupVisible(groupName:ParamGroup){
    return Object.entries(paramList).filter(([_paramName,paramData])=>{
        return paramData.group==groupName&&this.getParamVisible(paramData.name);
      }).length > 0;
  }

  public static resetParamDefault(){
    Object.keys(paramList).map((paramName) => {
      this.ensureSettings().setParamValues(paramName as ParamName,this.ensureSettings().getParamValueDefault(paramName as ParamName,this._steamIndex));
      this.setParamEnable(paramName as ParamName,this.ensureSettings().getParamEnableDefault(paramName as ParamName,this._steamIndex),true);
      this.settingChangeEventBus.dispatchEvent(new Event(paramName));
    })
  }

  public static setParamValue(paramName:ParamName,patchIndex:number,paramValue:any){
    var paramValues=this.ensureSettings().getParamValues(paramName);
    if(patchIndex>=paramValues.length){
      paramValues=this.getDefaultParamValues(paramName);
    }
    if(patchIndex>=0&&patchIndex<paramValues.length&&paramValue!=paramValues[patchIndex]){
      paramValues[patchIndex]=paramValue;
      this.ensureSettings().setParamValues(paramName,paramValues);
      Settings.saveSettingsToLocalStorage();
      Backend.applyConfig(this.getSettingsIndex(),this.getParamConfig());
      //this.settingChangeEventBus.dispatchEvent(new Event(paramName))
    }
  }

  public static getParamValue(paramName:ParamName,patchIndex:number){
    var paramValues=this.ensureSettings().getParamValues(paramName);
    //参数值无效时，重设置为默认值
    if(!this.isValidParamValue(paramValues,paramName,patchIndex)){
      paramValues=this.getDefaultParamValues(paramName);
      this.ensureSettings().setParamValues(paramName,paramValues);
    }
    return paramValues[patchIndex];
  }

  //获取参数配置的默认值
  public static getDefaultParamValues(paramName:ParamName){
    return paramList[paramName].patchs.map((value)=>{
      return value.defaultValue[this.getSettingsIndex()];
    });
  }

  public static getParamConfig(index?:number){
    return this.ensureSettings(index).toMangoConfig()??""
  }

  public static getParamConfigs(){
    var configs:string[]=[];
    for(var index = 0;index<5;index++) {
      var config = this.ensureSettings(index).toMangoConfig()
      configs.push(config);
      console.debug(`getConfigs index = ${index} config=${config}`);
    }
    return configs;
  }

  public static isValidParamValue(paramValues:any,paramName:ParamName,index:number){
    var defaultValues=this.getDefaultParamValues(paramName);
    if(paramValues.length!=defaultValues.length){
      return false;
    }
    var paramValue=paramValues[index];
    var paramPatch = paramList[paramName]?.patchs?.[index];
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
        //长度不一致，可能有新增参数项
        if(paramPatch.args.length != paramValue?.length){
          return false;
        }
        break;
      case(ParamPatchType.none):
        return false;
    }
    return true;
  }


  public static loadSettingsFromLocalStorage(){
    const settingsString = localStorage.getItem(SETTINGS_KEY) || "{}";
    const settingsJson = JSON.parse(settingsString);
    const loadSetting=serializer.deserializeObject(settingsJson, Settings);
    this._instance.enabled = loadSetting?.enabled??false;
    for(var index=0;index<5;index++){
      //确保有默认值
      if(!(index in this._instance.paramSettings)){
        this._instance.paramSettings[index]=new ParamSetting();
      }
      this._instance.paramSettings[index].initParamSetting(index);
      //加载保存值
      if(loadSetting?.paramSettings?.[index]){
        this._instance.paramSettings[index].copyParamSettings(loadSetting.paramSettings[index])
      }
    }      
  }

  public static saveSettingsToLocalStorage() {
    const settingsJson = serializer.serializeObject(this._instance);
    const settingsString = JSON.stringify(settingsJson);
    localStorage.setItem(SETTINGS_KEY, settingsString);
  }

}
