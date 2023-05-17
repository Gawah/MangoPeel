import * as schinese from "./schinese.json";
import * as tchinese from "./tchinese.json";
import * as english from "./english.json";
export const localizeMap = {
    schinese: {
      label: '简体中文',
      strings: schinese,
      credit: ["yxx"],
    },
    tchinese: {
        label: '繁體中文',
        strings: tchinese,
        credit: [],
      },
    english: {
      label: 'English',
      strings: english,
      credit: [],
    },  
};

export enum localizeStrEnum {
    MANGOINDEX_LABEL="MANGOINDEX_LABEL",
    MANGOINDEX_LABEL_CLOSE="MANGOINDEX_LABEL_CLOSE",
    RESET_PARAM_DEFAULT="RESET_PARAM_DEFAULT",
}
    