import {
  PanelSectionRow,
  SliderField
} from "decky-frontend-lib";
import {useState,useEffect, VFC} from "react";
import { localizeStrEnum,LocalizationManager} from "../i18n";
import { Backend, Settings } from "../util";

export const MangoIndex: VFC = () => {
  const [index, setIndex] = useState(Settings.getSettingsIndex());
  const checkUpdate=()=>{
    Backend.getSteamIndex().then((nowIndex)=>{
        setIndex(nowIndex);
        Settings.setSettingsIndex(nowIndex);
    });
  }
  useEffect(()=>{
    checkUpdate();
    var intervl=setInterval(()=>{
      checkUpdate();
    },200)
    //Settings.settingChangeEventBus.addEventListener("mangoIndex",updateEvent);
    return ()=>{
      clearInterval(intervl);
      //Settings.settingChangeEventBus.removeEventListener("mangoIndex",updateEvent);
  }
  },[])
  return (
        <div>
          <PanelSectionRow id="MangoPeel_IndexSlider">
            <SliderField
              label={LocalizationManager.getString(localizeStrEnum.MANGOINDEX_LABEL)}
              min={0}
              max={4}
              step={1}
              notchLabels={[
                {notchIndex: 0,label:LocalizationManager.getString(localizeStrEnum.MANGOINDEX_LABEL_CLOSE),value:0},
                {notchIndex: 1,label:"1",value:1},
                {notchIndex: 2,label:"2",value:2},
                {notchIndex: 3,label:"3",value:3},
                {notchIndex: 4,label:"4",value:4}
              ]}
              disabled={true}
              notchCount={5}
              value={index}
            />
          </PanelSectionRow>
          <style>
            {
              //底部标签置为灰色
              `#MangoPeel_IndexSlider
              .gamepadslider_SliderNotchTick_Fv1Ht.gamepadslider_TickActive_1gnUV {
                  background-color: #8b929a;
              }`
            }
          </style>
        </div>
    );
};

