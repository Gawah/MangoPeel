import { ServerAPI } from "decky-frontend-lib";
import { PluginState} from "./enum";
import { Backend} from "./backend";
import { localizationManager } from "../i18n/localization";
import { Settings } from "./settings";


export class PluginManager{
  private static state:PluginState;
  public static register = async(serverAPI:ServerAPI)=>{
    PluginManager.state = PluginState.INIT; 
    await Backend.init(serverAPI);
    await localizationManager.init(serverAPI);
    Settings.loadSettingsFromLocalStorage();
    PluginManager.state = PluginState.RUN;
  }

  public static isIniting()
  {
    return PluginManager.state==PluginState.INIT
  }

  public static unregister = ()=>{
    Backend.resetSettings();
    PluginManager.state = PluginState.QUIT; 
  }
}

