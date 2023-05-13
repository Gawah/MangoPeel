import {
  definePlugin,
  ServerAPI,
  staticClasses,
  PanelSection
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem } from "./components";
import { ParamGroup, PluginManager} from "./util";
import { paramList } from "./util/config";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
 
  return (
    <>
      <PanelSection>
        <MangoIndex></MangoIndex>
      </PanelSection>
      <>{
        Object.entries(ParamGroup).map(([groupName,_value])=>{
          var groupItem=Object.entries(paramList).filter(([_paramName, paramData]) => {
            return paramData.group==groupName;
          })
          return groupItem.length>0?(
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
