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
  public bVisible:boolean;
  @JsonProperty()
  public paramValues!:any[];  //某些参数可能包含多个值
  constructor(paramName:string,bEnable:boolean,paramValue:any[]){
    this.paramName=paramName;
    this.bEnable=bEnable;
    this.bVisible=true;
    this.setParamValue(paramValue);
  }
  public setParamValue(paramValue:any[]){
    this.paramValues=paramValue?.concat();
  }
}

@JsonObject()
export class paramSetting {
  @JsonProperty({isDictionary:true, type: paramInfo })
  public paramMap: { [paramName: string]: paramInfo|undefined } = {};
  //初始化所有参数
  public initParamSetting(defaultIndex:number){
    Object.entries(ParamName).forEach(([_key,paramName])=>{
      if(!this.paramMap[paramName]){
        this.paramMap[paramName]=new paramInfo(paramName,this.getParamEnableDefault(paramName,defaultIndex),this.getParamValueDefault(paramName,defaultIndex));
      }
    })
  }
  public ensureParamInfo(paramName:ParamName):paramInfo{
    if(!this.paramMap[paramName]){
      this.paramMap[paramName]=new paramInfo(paramName,false,[]);
    }
    return this.paramMap[paramName]!;
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

  public getParamValues(paramName:ParamName){
    return this.ensureParamInfo(paramName).paramValues??[];
  }

  public getParamVisible(paramName:ParamName){
    return this.ensureParamInfo(paramName).bVisible;
  }

  public setParamVisible(paramName:ParamName,visible:boolean){
    this.ensureParamInfo(paramName).bVisible=visible;
  }

  public getParamEnableDefault(paramName:ParamName,defaultIndex:number){
    return paramList[paramName]?.toggle.defaultEnable[defaultIndex];
  }

  public getParamValueDefault(paramName:ParamName,defaultIndex:number){
    return paramList[paramName]?.patch.map((value)=>{
      return value.defaultValue[defaultIndex];
    })
  }

  public getParamWork(paramName:ParamName){
    var paramEnable=this.getParamEnable(paramName);
    var paramVisible=this.getParamVisible(paramName);
    return paramVisible&&paramEnable;
  }
  /*
  public removeParam(paramName:ParamName){
    if(paramName in this.paramMap){
      this.paramMap[paramName]=undefined;
    }else{
      console.log(`paramName=${paramName}`);
    }
  }
  */
  public toMangoConfig(){
    var config = "";
    Object.entries(ParamGroup).forEach(([groupName,_value])=>{
      var groupItem=Object.entries(paramList).filter(([_paramName, paramData]) => {
        return paramData.group==groupName;
      })
      groupItem.forEach(([_str,paramData])=>{
        if(this.getParamWork(paramData.name)){
          config+=paramData.name;
          var valueList = this.getParamValues(paramData.name);
          console.log(`paramname=${paramData.name}  values=${valueList}`);
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
  private _steamIndex: number = 0;
  public static dependencyGraph: { [index: string]: string[] } = {};
  public static settingChangeEventBus:EventTarget = new EventTarget();
  @JsonProperty()
  public enabled: boolean = true;
  @JsonProperty({isDictionary:true, type: paramSetting })
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

  public static ensureDependence(paramName:ParamName){
    if(this.dependencyGraph[paramName])
      return this.dependencyGraph[paramName];
    var dependenceList=Object.entries(paramList).filter(([_paramName, paramData]) => {
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
    }).map(([paramName])=>{
      return paramName;
    });
    this.dependencyGraph[paramName]=dependenceList;
    return this.dependencyGraph[paramName];
  }

  //获取指定下标对应配置文件，默认为当前下标
  public static ensureSettings(index?:number): paramSetting {
    var getindex=index??this._instance._steamIndex;
    if(!(getindex in this._instance.paramSettings)){
      this._instance.paramSettings[getindex]=new paramSetting();
      this._instance.paramSettings[getindex].initParamSetting(getindex)
    }
    return this._instance.paramSettings[getindex];
  }

  public static getSettingsIndex():number{
    return this._instance._steamIndex;
  }

  public static setSettingsIndex(index:number){
    if(this._instance._steamIndex!=index){
      this._instance._steamIndex=index;
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

  public static setParamEnable(paramName:ParamName,bEnable:boolean){
    if(bEnable!=this.getParamEnable(paramName)){
      this.ensureSettings().setParamEnale(paramName,bEnable);
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

  /*
  public static resetParamDefault(paramName:ParamName){
    this.setParamEnable(paramName,this.ensureSettings().getParamEnableDefault(paramName,this._instance.steamIndex));
    this.settingChangeEventBus.dispatchEvent(new Event(paramName));
  }
  */

  public static setParamValue(paramName:ParamName,patchIndex:number,paramValue:any){
    var paramValues=this.ensureSettings().getParamValues(paramName);
    if(patchIndex>=paramValues.length){
      paramValues=this.getDefaultParamValues(paramName);
    }
    if(patchIndex>=0&&patchIndex<paramValues.length&&paramValue!=paramValues[patchIndex]){
      paramValues[patchIndex]=paramValue;
      this.ensureSettings().setParamValue(paramName,paramValues);
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
      this.ensureSettings().setParamValue(paramName,paramValues);
    }
    return paramValues[patchIndex];
  }

  //获取参数配置的默认值
  public static getDefaultParamValues(paramName:ParamName){
    return paramList[paramName].patch.map((value)=>{
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
    var paramPatch = paramList[paramName]?.patch?.[index];
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
      case(ParamPatchType.none):
        return false;
    }
    return true;
  }


  static loadSettingsFromLocalStorage(){
    const settingsString = localStorage.getItem(SETTINGS_KEY) || "{}";
    const settingsJson = JSON.parse(settingsString);
    const loadSetting=serializer.deserializeObject(settingsJson, Settings);
    this._instance.enabled = loadSetting?.enabled??false;      
    this._instance.paramSettings = loadSetting?.paramSettings??{};
    console.log(`loadSettingStr=${settingsString}`);
  }

  static saveSettingsToLocalStorage() {
    const settingsJson = serializer.serializeObject(this._instance);
    const settingsString = JSON.stringify(settingsJson);
    localStorage.setItem(SETTINGS_KEY, settingsString);
    console.log(`saveSettingStr=${settingsString}`)
  }

}
