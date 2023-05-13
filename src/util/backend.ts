import {ServerAPI } from "decky-frontend-lib";
export class Backend {
  private static serverAPI: ServerAPI;
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  public static applyConfig(index:number,config:string){
    console.log(`index=${index} config=${config} `);
    this.serverAPI!.callPluginMethod("SetOverwriteConfig",{"index":index,"config":config})
  }

  public static applyConfigs(configs:string[]){
    console.log(`configs=${configs}`);
    this.serverAPI!.callPluginMethod("SetOverwriteConfigs",{"configs":configs})
  }

  public static resetSettings = () => {
    console.log("重置所有设置");
  };
}
