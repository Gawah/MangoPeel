import { ServerAPI } from "decky-frontend-lib";
import { Backend} from "./backend";
import { LocalizationManager } from "../i18n/localization";
import { Settings } from "./settings";
import { Config } from "./config";
import { prefStore } from "./perfStore";


export class PluginManager{
  public static register = async(serverAPI:ServerAPI)=>{
    await Config.init(serverAPI);
    await prefStore.init();
    await Backend.init(serverAPI);
    await Settings.init();
    await LocalizationManager.init();
    Backend.reloadConfig();
    Backend.applyConfigs(Settings.toMangoConfigs());
  }

  public static unregister = (_serverAPI:ServerAPI)=>{
    
  }
}

