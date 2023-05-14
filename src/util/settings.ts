import { JsonObject, JsonProperty, JsonSerializer } from 'typescript-json-serializer';
import { Backend } from './backend';
import { paramList } from './config';
import { ParamGroup, ParamName, ParamPatchType} from './enum';

const SETTINGS_KEY = "MangoPeel";
const serializer = new JsonSerializer();

@JsonObject()
export class paramInfo {
  @JsonProperty()
  public paramName:string;
  @JsonProperty()
  public bEnable:boolean;
  @JsonProperty()
  public paramValue!:any[];
  constructor(paramName:string,bEnable:boolean,paramValue:any[]){
    this.paramName=paramName;
    this.bEnable=bEnable;
    this.setParamValue(paramValue);
  }
  public setParamValue(paramValue:any[]){
    this.paramValue=paramValue.concat();
  }
}

@JsonObject()
export class paramSetting {
  @JsonProperty({isDictionary:true, type: paramInfo })
  public paramMap: { [paramName: string]: paramInfo|undefined } = {};

  public ensureParamInfo(paramName:ParamName):paramInfo{
    if(!(paramName in this.paramMap)){
      var steamIndex = Settings.getSettingsIndex();
      this.paramMap[paramName]=new paramInfo(paramName,paramList[paramName]?.toggle.defaultEnable[steamIndex],paramList[paramName]?.patch.map((value)=>{
        return value.defaultValue[steamIndex];
      }));
    }
    return this.paramMap[paramName]!!;
  }
  public setParamEnale(paramName:ParamName,bEnable:boolean){
    this.ensureParamInfo(paramName).bEnable=bEnable;
  }
  public getParamEnable(paramName:ParamName){
    return this.ensureParamInfo(paramName).bEnable;
  }
  public setParamValue(paramName:ParamName,paramValue:any[]){
    this.ensureParamInfo(paramName).setParamValue(paramValue);
  }

  public getParamValue(paramName:ParamName){
    return this.ensureParamInfo(paramName).paramValue;
  }

  public removeParam(paramName:ParamName){
    if(!(paramName in this.paramMap)){
      this.paramMap[paramName]=undefined;
    }
  }

  public toMangoConfig(){
    var config = "";
    Object.entries(ParamGroup).forEach(([groupName,_value])=>{
      var groupItem=Object.entries(paramList).filter(([_paramName, paramData]) => {
        return paramData.group==groupName;
      })
      groupItem.forEach(([_str,paramData])=>{
        if(this.getParamEnable(paramData.name)){
          config+=paramData.name;
          var valueList = this.getParamValue(paramData.name);
          if(valueList.length>0){
            config+="=";
            valueList.forEach((value,index)=>{
              if(index!=0){
                config+=",";
              }
              config+=`${value}`;
            })
          }
          config+="\n";
        }
        //一些特殊的参数 未开启时也要写入param=xxx
        else{
          switch(paramData.name){
            case ParamName.legacy_layout:
              config+=`${ParamName.legacy_layout}=0\n`;
              break;
          }
        }
      })
    })
    return config;
  }
}


@JsonObject()
export class Settings {
  private static _instance:Settings = new Settings();
  private static _paramVisible:{ [index: string]: boolean } = {};
  public static settingChangeEventBus:EventTarget = new EventTarget();
  @JsonProperty()
  public enabled: boolean = true;
  @JsonProperty()
  public steamIndex: number = 0;
  @JsonProperty({isDictionary:true, type: Settings })
  public paramSettings: { [index: number]: paramSetting } = {};
  
  //插件是否开启
  public static ensureEnable():boolean{
    return this._instance.enabled;
  }

  //设置开启关闭
  public static setEnable(enabled:boolean){
    if(this._instance.enabled != enabled){
      this._instance.enabled = enabled;
      Settings.saveSettingsToLocalStorage();
    }
  }

  //获取当前下标对应配置文件
  public static ensureSettings(): paramSetting {
    if(!(this._instance.steamIndex in this._instance.paramSettings))
      this._instance.paramSettings[this._instance.steamIndex]=new paramSetting();
    return this._instance.paramSettings[this._instance.steamIndex];
  }

  public static getSettingsIndex():number{
    return this._instance.steamIndex;
  }

  public static setSettingsIndex(index:number){
    if(this._instance.steamIndex!=index){
      this._instance.steamIndex=index;
      //刷新整个界面
      for(var paramName in ParamName){
        this.settingChangeEventBus.dispatchEvent(new Event(paramName))
      }
      for(var groupName in ParamGroup){
        this.settingChangeEventBus.dispatchEvent(new Event(groupName))
      }
      //Object.entries(this.ensureSettings().paramMap).forEach(([paramName,_paramInfo])=>{})
    }
  }

  public static setParamEnable(paramName:ParamName,bEnable:boolean){
    if(bEnable!=this.getParamEnable(paramName)){
      this.ensureSettings().setParamEnale(paramName,bEnable);
      var updateGroupList:ParamGroup[]=[];
      //刷新前置参数包含此参数的组件
      Object.entries(paramList).filter(([_paramName, paramData]) => {
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
      }).forEach(([_str,paramData])=>{
        this.settingChangeEventBus.dispatchEvent(new Event(paramData.name));
        if(updateGroupList.indexOf(paramData.group)==-1){
          updateGroupList.push(paramData.group);
        }
      })
      //刷新对应的参数组标题
      updateGroupList.forEach((groupName)=>{
        this.settingChangeEventBus.dispatchEvent(new Event(groupName));
      })
      
      Backend.applyConfig(this.getSettingsIndex(),this.ensureSettings().toMangoConfig());
    }
  }

  public static getParamEnable(paramName:ParamName){
    return this.ensureSettings().getParamEnable(paramName);
  }

  public static getParamVisible(paramName:ParamName){
    var paramVisible=false;
    //未配置前置参数时默认可见
    if(paramList[paramName].preCondition==undefined||paramList[paramName].preCondition?.length==0){
      paramVisible=true;
    }else{
      //配置前置参数时，有一组满足条件即为可见
      for(var targetState of paramList[paramName].preCondition!){
        paramVisible=true;
        targetState.enable?.forEach(name => {
          var paramEnable=this.getParamEnable(name);
          if(paramEnable!=true)
            paramVisible=false;
        });
        targetState.disable?.forEach(name => {
          var paramEnable=this.getParamEnable(name);
          if(paramEnable!=false)
            paramVisible=false;
        });
        if(paramVisible)
          break;
      }
    }
    if(!paramVisible)
      this.setParamEnable(paramName,false);
    this._paramVisible[paramName]=paramVisible;
    return paramVisible;
  }

  public static getGroupVisibleParamLength(groupName:ParamGroup){
    if(!(groupName in this._paramVisible)){
      Object.entries(paramList).filter(([_paramName,paramData])=>{
        return paramData.group==groupName;
      }).forEach(([_paramName,paramData])=>{
        this.getParamVisible(paramData.name);
      });
    }
    return Object.entries(this._paramVisible).filter(([paramName,paramVisible])=>{
      return paramList[paramName].group==groupName && paramVisible;
    })?.length;
  }

  public static setParamValue(paramName:ParamName,index:number,paramValue:any){
    var paramValueArray=this.ensureSettings().getParamValue(paramName);
    if(index>=0&&index<paramValueArray.length&&paramValue!=paramValueArray[index]){
      paramValueArray[index]=paramValue;
      this.ensureSettings().setParamValue(paramName,paramValueArray);
      Backend.applyConfig(this.getSettingsIndex(),this.ensureSettings().toMangoConfig());
      //this.settingChangeEventBus.dispatchEvent(new Event(paramName))
    }
  }

  public static getParamValue(paramName:ParamName,index:number){
    var paramValueArray=this.ensureSettings().getParamValue(paramName);
    //参数值无效时，取默认值
    if(!this.isValidParamValue(paramValueArray,paramName,index)){
      paramValueArray=paramList[paramName].patch.map((value)=>{
        return value.defaultValue[this.getSettingsIndex()];
      });
    }
    return paramValueArray[index];
  }

  public static isValidParamValue(paramValueArray:any[],paramName:ParamName,index:number){
    console.debug(`array=${paramValueArray} paramName=${paramName} index=${index}`);
    //首先判断当前的长度是否大于0且index不超过数组长度
    if(!paramValueArray||paramValueArray.length<0||paramValueArray.length<=index)
      return false;
    var paramValue = paramValueArray[index];
    var paramPatch = paramList[paramName]?.patch?.[index];
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
      case(ParamPatchType.none):
        return false;
    }
    return true;
  }


  static loadSettingsFromLocalStorage(){
    const settingsString = localStorage.getItem(SETTINGS_KEY) || "{}";
    const settingsJson = JSON.parse(settingsString);
    const loadSetting=serializer.deserializeObject(settingsJson, Settings);
    this._instance = loadSetting??this._instance??new Settings();
  }

  static saveSettingsToLocalStorage() {
    const settingsJson = serializer.serializeObject(this._instance);
    const settingsString = JSON.stringify(settingsJson);
    localStorage.setItem(SETTINGS_KEY, settingsString);
  }

}
