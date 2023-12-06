import {
  Marquee,
  PanelSectionRow,
  SliderField,
  ToggleField
} from "decky-frontend-lib";
import {useEffect, useState, VFC} from "react";
import { localizeStrEnum,LocalizationManager} from "../i18n";
import { DEFAULT_APP, RunningApps, Settings, prefStore } from "../util";

export const MangoIndex: VFC = () => {
  const [index, setIndex] = useState(Settings.getSettingsIndex());
  const [disabledSlider, setDisableSlider] = useState<boolean>(prefStore.getSteamIndex()==-1);
  const [override, setOverWrite] = useState<boolean>(Settings.perAppOverWrite());
  const [overrideable,setOverWriteable] = useState<boolean>(RunningApps.active()!=DEFAULT_APP);
  //刷新界面
  const updateEvent=(index:number)=>{
    setIndex(index);
    setOverWrite(Settings.perAppOverWrite());
    setOverWriteable(RunningApps.active()!=DEFAULT_APP);
    setDisableSlider(prefStore.getSteamIndex()==-1)
  }

  useEffect(()=>{
    //监听overlayLevel
    prefStore.registerOverlayLevelListener(updateEvent);
    return ()=>{
      prefStore.removeOverlayLevelListener(updateEvent);
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
                setIndex(value);
                //console.log("value=",value,"diabledUpdate=",disabledUpdate.current)
                //Settings.setSettingsIndex(value);
                prefStore.setSteamIndex(value);
              }}
            />
          </PanelSectionRow>
          <PanelSectionRow>
          <ToggleField
            label={LocalizationManager.getString(localizeStrEnum.USE_PERAPP_CONFIG_LABEL)}
            description={
              <div style={{ display: "flex", justifyContent: "left" }}>
                <img src={RunningApps.active_appInfo()?.icon_data ? "data:image/" + RunningApps.active_appInfo()?.icon_data_format + ";base64," + RunningApps.active_appInfo()?.icon_data : "/assets/" + RunningApps.active_appInfo()?.appid + "_icon.jpg?v=" + RunningApps.active_appInfo()?.icon_hash} width={20} height={20}
                  style={{ paddingRight:"5px",display: override && overrideable ? "block" : "none" }}
                />
                <div style={{lineHeight:"20px",whiteSpace:"pre"}}>{LocalizationManager.getString(localizeStrEnum.USING) + (override && overrideable ?"『":"")}</div>
                <Marquee play={true} fadeLength={10} delay={1} style={{
                  maxWidth:"100px",
                  lineHeight:"20px",
                  whiteSpace:"pre",
                }}>
                {(override && overrideable ? `${RunningApps.active_appInfo()?.display_name}` : `${LocalizationManager.getString(localizeStrEnum.DEFAULT)}`)}
                </Marquee>
                <div style={{lineHeight:"20px",whiteSpace:"pre",}}>{(override && overrideable ?"』":"")+LocalizationManager.getString(localizeStrEnum.MANGOLEVEL)}</div>
                
              </div>
            }
            checked={override && overrideable}
            disabled={!overrideable}
            onChange={(override) => {
              setOverWrite(override);
              Settings.setPerAppOverWrite(override);
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

