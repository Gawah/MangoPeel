import {
  definePlugin,
  staticClasses,
  PanelSection,
  ButtonItem,
  PanelSectionRow,
} from "@decky/ui";
import { VFC,useEffect,useState} from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem} from "./components";
import { LocalizationManager, localizeStrEnum } from "./i18n";
import { ParamGroup, PluginManager, Settings} from "./util";
import { Config } from "./util/config";
import ParamGroupTabs from "./components/ParamGroupTabs";


const Content: VFC<{ }> = ({}) => {
  const getNewProps=()=>{
    return Object.values(ParamGroup).map((groupName) => {
      var groupItem = Object.values(Config.paramList).filter((paramData) => {
        return paramData.group == groupName;
      });
      return { groupName, groupItem };
    }).filter(({ groupName, groupItem }) => {
      if (groupItem.length == 0)
        return false;
      return Settings.getGroupVisible(Settings.getSettingsIndex(), groupName);
    }).map(({ groupName, groupItem }) => {
      return {
        label: groupName, id: groupName, Node: <div>
          {groupItem.map((paramData) => {
            return (
              <div>
                <ParamItem key={paramData.name} paramData={paramData}></ParamItem>
              </div>);
          })}
        </div>
      };
    })
  }
  const [props,setprops]=useState<{label:string,id:string,Node:any}[]>(getNewProps());
  useEffect(() => {
    const updateProps=()=>{
      setprops(getNewProps())
    }
    Object.values(ParamGroup).map((groupName) => {
      Settings.settingChangeEventBus.addEventListener(groupName, updateProps);
    })
    return () => {
      Object.values(ParamGroup).map((groupName) => {
        Settings.settingChangeEventBus.removeEventListener(groupName, updateProps);
      })
    };
  }, []);
  return (
    <>
      <PanelSection>
        <MangoIndex></MangoIndex>
      <>
        <ParamGroupTabs props={props}></ParamGroupTabs>
      </>
      </PanelSection>
      <PanelSection>
        <PanelSectionRow>
            <ButtonItem
            layout="below"
            onClick={() => {
              Settings.resetAllParamDefault();
            }}>
            {LocalizationManager.getString(localizeStrEnum.RESET_PARAM_DEFAULT)}
            </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};

export default definePlugin(() => {
  PluginManager.register();
  return {
    title: <div className={staticClasses.Title}>MangoPeel</div>,
    content: <Content />,
    icon: <FaBorderStyle />,
    onDismount() {
      PluginManager.unregister();
    },
  };
});
