import { call } from "@decky/api";
export class Backend {
  private static applyCount:number;
  public static async init() {
    this.applyCount = 0;
  }

  public static async getSteamIndex(){
    var steamindex = 0;
    // await this.serverAPI!.callPluginMethod<{},number>("get_steamIndex",{}).then(res=>{
    //   if (res.success){
    //     steamindex = res.result;
    //   }
    // })
    await call<[], number>("get_steamIndex").then(res=>{
      if (res){
        steamindex = res;
      }
    })
    return steamindex;
  }

  public static reloadConfig(){
    // this.serverAPI!.callPluginMethod<{},boolean>("ReloadConfigPath",{}).then(res=>{
    //   if (res.success){
    //     console.debug("ReloadConfigPath = " + res.result);
    //   }
    // })
    call<[], boolean>("ReloadConfigPath").then(res=>{
      if (res){
        console.debug("ReloadConfigPath = " + res);
      }
    })
  }
  public static applyConfig(index:number,config:string){
    this.applyCount=this.applyCount+1;
    //取200ms内的最后一次覆写请求，防止连续写入导致mangoapp闪退
    setTimeout(()=>{
      this.applyCount=this.applyCount-1;
      if(this.applyCount==0){
        // this.serverAPI!.callPluginMethod<{},boolean>("SetOverwriteConfig",{"index":index,"config":config})
        call<[number,string], boolean>("SetOverwriteConfig", index, config).then(res => {
          if (res){
            console.debug("SetOverwriteConfig = " + res);
          }
        })
      }
    },200)
  }

  public static applyConfigs(configs:string[]){
    // this.serverAPI!.callPluginMethod<{},boolean>("SetOverwriteConfigs",{"configs":configs})
    call<[string[]], boolean>("SetOverwriteConfigs", configs).then(res => {
      if (res){
        console.debug("SetOverwriteConfigs = " + res);
      }
    })
  }

  public static async getSettings(): Promise<any> {
    const res = await call<[], any>("get_settings");
    if (!res) {
      return {};
    }
    return res;
  }

  public static async setSettings(settings: any): Promise<boolean> {
    return await call<[any], boolean>("set_settings", settings);
  }
  
}
