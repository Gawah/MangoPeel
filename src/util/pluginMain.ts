import { ServerAPI } from "decky-frontend-lib";
import { Backend} from "./backend";
import { localizationManager } from "../i18n/localization";
import { Settings } from "./settings";


export class PluginManager{
  public static register = async(serverAPI:ServerAPI)=>{
    await Settings.init();
    await localizationManager.init();
    await Backend.init(serverAPI);
    Backend.applyConfigs(Settings.getParamConfigs());
  }

  public static unregister = ()=>{

  }
}

