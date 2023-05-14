import {
  definePlugin,
  ServerAPI,
  staticClasses,
  PanelSection
} from "decky-frontend-lib";
import { VFC,useEffect,useState} from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem } from "./components";
import { Backend, ParamGroup, PluginManager, Settings} from "./util";
import { paramList } from "./util/config";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  useEffect(()=>{
    Backend.getSteamIndex().then((res)=>{
      Settings.setSettingsIndex(res);
    });
  },[])
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
          const [visible,setVisible] = useState(Settings.getGroupVisibleParamLength(groupName)>0);
          console.log(`initGroupEvent ${groupName}`);
          useEffect(()=>{
            const updateEvent=()=>{
              console.log(`UpdateGroupEvent ${groupName}`);
              setVisible(Settings.getGroupVisibleParamLength(groupName)>0);
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
