import {ServerAPI } from "decky-frontend-lib";
export class Backend {
  private static serverAPI: ServerAPI;
  private static applyCount:number;
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.applyCount = 0;
  }

  public static async getSteamIndex(){
    var steamindex = 0;
    await this.serverAPI!.callPluginMethod<{},number>("get_steamIndex",{}).then(res=>{
      if (res.success){
        steamindex = res.result;
      }
    })
    return steamindex;
  }

  public static reloadConfig(){
    this.serverAPI!.callPluginMethod<{},boolean>("ReloadConfigPath",{}).then(res=>{
      if (res.success){
        console.debug("ReloadConfigPath = " + res.result);
      }
    })
  }
  public static applyConfig(index:number,config:string){
    this.applyCount=this.applyCount+1;
    //取200ms内的最后一次覆写请求，防止连续写入导致mangoapp闪退
    setTimeout(()=>{
      this.applyCount=this.applyCount-1;
      if(this.applyCount==0){
        this.serverAPI!.callPluginMethod<{},boolean>("SetOverwriteConfig",{"index":index,"config":config})
      }
    },200)
  }

  public static applyConfigs(configs:string[]){
    this.serverAPI!.callPluginMethod<{},boolean>("SetOverwriteConfigs",{"configs":configs})
  }
  
}
