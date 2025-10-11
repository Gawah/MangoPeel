import { localizeMap, localizeStrEnum } from "./localizeMap";

export class LocalizationManager {
  private static language: keyof typeof localizeMap = "en";

  public static async init() {
    this.language = window.LocalizationManager.m_rgLocalesToUse[0] as keyof typeof localizeMap;
    console.debug(`this.language=${this.language}`);
  }

  public static getString(defaultString: localizeStrEnum) {
    const str =
      (localizeMap[this.language]?.strings as any)?.[defaultString] ??
      (localizeMap["en"]?.strings as any)?.[defaultString] ??
      defaultString;
    return str;
  }
}

