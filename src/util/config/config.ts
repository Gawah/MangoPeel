import { paramList as paramList_rel,paramOrder as paramOrder_rel,steamParamDefalut as steamParamDefalut_rel } from "./config_rel"
import { paramList as paramList_main,paramOrder as paramOrder_main,steamParamDefalut as steamParamDefalut_main  } from "./config_main"
import { ParamData, SteamParamDefalut } from "../interface";
import { SteamChannel} from "../enum";
import { ServerAPI } from "decky-frontend-lib";

export class Config {
  private static serverAPI: ServerAPI;
  private static channel: SteamChannel;
  public static paramList:{ [paramName: string]: ParamData };
  public static steamParamDefault:{[ParamName:string]:SteamParamDefalut}[];
  public static paramOrder:{ [paramName: string]: number };
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.channel = SteamChannel.rel;
    this.paramList = {};
    await this.getSteamChannel();
    await this.loadConfig();
  }

  public static async getSteamChannel(){
    await this.serverAPI!.callPluginMethod<{},string>("get_steamChannel",{}).then(res=>{
      if (res.success){
        this.channel = res.result as SteamChannel;
      }
    })
  }

  public static loadConfig (){
    console.log(`steamchannel=${this.channel}`);
    if(this.channel == SteamChannel.rel){
      this.paramList = paramList_rel;
      this.paramOrder = paramOrder_rel;
      this.steamParamDefault = steamParamDefalut_rel;
    }else if (this.channel == SteamChannel.main){
      this.paramList = paramList_main;
      this.paramOrder = paramOrder_main;
      this.steamParamDefault = steamParamDefalut_main;
    }else{
      this.paramList = paramList_main;
      this.paramOrder = paramOrder_main;
      this.steamParamDefault = steamParamDefalut_main;
    }
  }
}

