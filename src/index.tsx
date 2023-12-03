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
import ParamGroupTabs from "./components/ParamGroupTabs";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  return (
    <>
      <PanelSection>
        <MangoIndex></MangoIndex>
      <>
        <ParamGroupTabs props={Object.values(ParamGroup).map((groupName)=>{
          var groupItem=Object.values(Config.paramList).filter((paramData) => {
            return paramData.group==groupName;
          })
          return {groupName,groupItem}; 
        }).filter(({groupName,groupItem})=>{
          if(groupItem.length==0)
            return false;
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
          return visible
        }).map(({groupName,groupItem})=>{
          return {label:groupName,Node:<div>
          {groupItem.map((paramData)=>{
            return(
              <>
                <ParamItem key={paramData.name} paramData={paramData}></ParamItem>
              </>)
            })}
          </div>}
        })
        }></ParamGroupTabs>
      </>
      </PanelSection>
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
