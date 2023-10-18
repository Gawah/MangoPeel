import {
  definePlugin,
  ServerAPI,
  staticClasses,
  PanelSection,
  ButtonItem,
  PanelSectionRow,
} from "decky-frontend-lib";
import { VFC,useEffect,useState} from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem} from "./components";
import { LocalizationManager, localizeStrEnum } from "./i18n";
import { ParamGroup, PluginManager, Settings} from "./util";
import { Config } from "./util/config";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  return (
    <>
      <PanelSection>
        <MangoIndex></MangoIndex>
      </PanelSection>
      <>{
        Object.values(ParamGroup).map((groupName)=>{
          var groupItem=Object.values(Config.paramList).filter((paramData) => {
            return paramData.group==groupName;
          })
          const [visible,setVisible] = useState(Settings.getGroupVisible(Settings.getSettingsIndex(),groupName));
          useEffect(()=>{
            const updateEvent=()=>{
              setVisible(Settings.getGroupVisible(Settings.getSettingsIndex(),groupName));
            }
            Settings.settingChangeEventBus.addEventListener(groupName,updateEvent);
            return ()=>{
              Settings.settingChangeEventBus.removeEventListener(groupName,updateEvent);
          }
          },[])
          return groupItem.length>0&&visible?(
          <PanelSection title={groupName}>
          {groupItem.map((paramData)=>{
            return(
              <>
                <ParamItem paramData={paramData}></ParamItem>
              </>)
            })}
          </PanelSection>
          ):(<></>)
        })}
      </>
      <PanelSection>
        <PanelSectionRow>
            <ButtonItem
            layout="below"
            onClick={() => {
              Settings.resetParamDefault();
            }}>
            {LocalizationManager.getString(localizeStrEnum.RESET_PARAM_DEFAULT)}
            </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PluginManager.register(serverApi);
  return {
    title: <div className={staticClasses.Title}>MangoPeel</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaBorderStyle />,
    onDismount() {
      PluginManager.unregister(serverApi);
    },
  };
});
