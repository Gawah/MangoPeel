import { localizeMap, localizeStrEnum } from "./localizeMap";

export class LocalizationManager {
  private static language = "en";

  public static async init() {
    this.language = window.LocalizationManager.m_rgLocalesToUse[0];
    console.debug(`this.language=${this.language}`);
  }

  public static getString(defaultString: localizeStrEnum) {
    const str =
      localizeMap[this.language]?.strings?.[defaultString] ??
      localizeMap["en"]?.strings?.[defaultString] ??
      defaultString;
    return str;
  }
}

