import {
  PanelSectionRow,
  SliderField
} from "decky-frontend-lib";
import {useEffect, useRef, useState, VFC} from "react";
import { localizeStrEnum,LocalizationManager} from "../i18n";
import { Backend, Settings, prefStore } from "../util";

export const MangoIndex: VFC = () => {
  const [index, setIndex] = useState(Settings.getSettingsIndex());
  const [disabledSlider, setDisableSlider] = useState<boolean>(prefStore.getSteamIndex()==-1);
  const disabledUpdate = useRef<number>(0);
  const checkUpdate=()=>{
    if(disabledUpdate.current){
      return;
    }
    //perfstore拿不到下标时，回退到后端获取
    var perfStoreLevel = prefStore.getSteamIndex();
    setDisableSlider(perfStoreLevel==-1);
    if(perfStoreLevel==-1){
      Backend.getSteamIndex().then((nowIndex)=>{
        setIndex(nowIndex);
        //console.log("nowIndex=",nowIndex,"diabledUpdate=",disabledUpdate.current)
        Settings.setSettingsIndex(nowIndex);
    });
    }else{
      setIndex(perfStoreLevel);
      //console.log("perfStoreLevel=",perfStoreLevel,"diabledUpdate=",disabledUpdate.current)
      Settings.setSettingsIndex(perfStoreLevel);
    }
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
              disabled={disabledSlider}
              notchCount={5}
              value={index}
              onChange={(value)=>{
                disabledUpdate.current++;
                setIndex(value);
                //console.log("value=",value,"diabledUpdate=",disabledUpdate.current)
                setTimeout(()=>{
                  disabledUpdate.current--;
                },1000)
                Settings.setSettingsIndex(value);
                prefStore.setSteamIndex(value);
              }}
            />
          </PanelSectionRow>
          {
            disabledSlider&&
            <style>
            {
              //底部标签置为灰色
              `#MangoPeel_IndexSlider
              .gamepadslider_SliderNotchTick_Fv1Ht.gamepadslider_TickActive_1gnUV {
                  background-color: #8b929a!important;
                  background: #8b929a!important;
              }`
            }
          </style>
          }
        </div>
    );
};

