import { paramList as paramList_rel } from "./config_rel"
import { paramList as paramList_main } from "./config_main"
import { ParamData } from "../interface";
import { steamChannel} from "../enum";
import { ServerAPI } from "decky-frontend-lib";

export class Config {
  private static serverAPI: ServerAPI;
  private static channel: steamChannel;
  public static paramList:{ [paramName: string]: ParamData };
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.channel = steamChannel.rel;
    this.paramList = {};
    await this.getSteamChannel();
    await this.loadConfig();
  }

  public static async getSteamChannel(){
    await this.serverAPI!.callPluginMethod<{},string>("get_steamChannel",{}).then(res=>{
      if (res.success){
        this.channel = res.result as steamChannel;
      }
    })
  }

  public static loadConfig (){
    console.log(`steamchannel=${this.channel}`);
    if(this.channel == steamChannel.rel){
      this.paramList = paramList_rel;
    }else if (this.channel == steamChannel.main){
      this.paramList = paramList_main;
    }else{
      this.paramList = paramList_main;
    }
  }
}

