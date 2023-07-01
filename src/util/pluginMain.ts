import { ServerAPI } from "decky-frontend-lib";
import { Backend} from "./backend";
import { LocalizationManager } from "../i18n/localization";
import { Settings } from "./settings";


export class PluginManager{
  public static register = async(serverAPI:ServerAPI)=>{
    await Settings.init();
    await LocalizationManager.init();
    await Backend.init(serverAPI);
    Backend.reloadConfig();
    Backend.applyConfigs(Settings.getParamConfigs());
  }

  public static unregister = (_serverAPI:ServerAPI)=>{

  }
}

