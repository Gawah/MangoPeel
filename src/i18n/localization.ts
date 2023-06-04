import { localizeMap, localizeStrEnum } from "./localizeMap";

export class localizationManager {
  private static language = "en"
  //private has_language  = false
  public static async init() {
    this.language = window.LocalizationManager.m_rgLocalesToUse[0];
    console.debug(`this.language=${this.language}`);
  }
  public static getString(defaultString:localizeStrEnum){
    var str = localizeMap[this.language]?.strings?.[defaultString]??localizeMap["en"]?.strings?.[defaultString]??defaultString;
    return str
  }
}

