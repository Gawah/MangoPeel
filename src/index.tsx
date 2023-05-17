import {
  definePlugin,
  ServerAPI,
  staticClasses,
  PanelSection,
  ButtonItem,
  PanelSectionRow
} from "decky-frontend-lib";
import { VFC,useEffect,useState} from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem } from "./components";
import { localizationManager, localizeStrEnum } from "./i18n";
import { ParamGroup, PluginManager, Settings} from "./util";
import { paramList } from "./util/config";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  return (
    <>
      <PanelSection>
        <MangoIndex></MangoIndex>
      </PanelSection>
      <>{
        Object.entries(ParamGroup).map(([_key,groupName])=>{
          var groupItem=Object.entries(paramList).filter(([_paramName, paramData]) => {
            return paramData.group==groupName;
          })
          const [visible,setVisible] = useState(Settings.getGroupVisible(groupName));
          console.log(`initGroupEvent ${groupName}`);
          useEffect(()=>{
            const updateEvent=()=>{
              console.log(`UpdateGroupEvent ${groupName}`);
              setVisible(Settings.getGroupVisible(groupName));
            }
            Settings.settingChangeEventBus.addEventListener(groupName,updateEvent);
            return ()=>{
              Settings.settingChangeEventBus.removeEventListener(groupName,updateEvent);
              console.log(`removeUpdateGroupEvent ${groupName}`);
          }
          },[])
          return groupItem.length>0&&visible?(
          <PanelSection title={groupName}>
          {groupItem.map(([_paramName, paramData])=>{
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
            {localizationManager.getString(localizeStrEnum.RESET_PARAM_DEFAULT)}
            </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PluginManager.register(serverApi);
  serverApi!.callPluginMethod<{},boolean>("ReloadConfigPath",{}).then(res=>{
    if (res.success){
      console.info("ReloadConfigPath = " + res.result);
    }
  })
  return {
    title: <div className={staticClasses.Title}>MangoPeel</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaBorderStyle />,
    onDismount() {
    },
  };
});
