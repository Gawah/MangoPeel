import {
  definePlugin,
  staticClasses,
  PanelSection,
  ButtonItem,
  PanelSectionRow,
  Tabs,
} from "@decky/ui";
import { FC, useEffect, useState } from "react";
import { FaBorderStyle } from "react-icons/fa";
import { MangoIndex, ParamItem } from "./components";
import { LocalizationManager, localizeStrEnum } from "./i18n";
import { ParamGroup, PluginManager, Settings } from "./util";
import { Config } from "./util/config";
// import ParamGroupTabs from "./components/ParamGroupTabs";


const Content: FC<{}> = ({ }) => {
  const getNewProps = () => {
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
        title: groupName,
        id: groupName,
        content: <div style={{ marginLeft: "-10px", marginRight: "-10px" }}>
          <PanelSection>
            {groupItem.map((paramData) => {
              return (
                // @ts-ignore
                <ParamItem key={paramData.name} paramData={paramData}></ParamItem>
              );
            })}
          </PanelSection>
        </div>
      };
    })
  }
  const [props, setprops] = useState<{ title: string, id: string, content: any }[]>(getNewProps());
  const [currentTabRoute, setCurrentTabRoute] = useState<string>(
    Settings.getCurrentTabRoute() || (props.length > 0 ? props[0].id : "")
  );

  const updateCurrentTabRoute = (route: string) => {
    setCurrentTabRoute(route);
    Settings.setCurrentTabRoute(route);
  };

  useEffect(() => {
    const updateProps = () => {
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
  useEffect(() => {
    // When props change, ensure currentTabRoute is valid
    const savedRoute = Settings.getCurrentTabRoute();
    const isValidRoute = props.some(p => p.id === savedRoute);

    if (!isValidRoute && props.length > 0) {
      updateCurrentTabRoute(props[0].id);
    } else if (isValidRoute && savedRoute !== currentTabRoute) {
      setCurrentTabRoute(savedRoute);
    }
  }, [props]);
  return (
    <>
      <style>
        {`
.main-tabs > div > div:first-child::before {
  background: transparent;
  box-shadow: none;
  backdrop-filter: blur(50px);
}
`}
      </style>
      <PanelSection>
        <MangoIndex />
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
      {props.length > 0 && (
        <div
          className="main-tabs"
          style={{
            height: "95%",
            width: "300px",
            marginTop: "-12px",
            position: "absolute",
            overflow: "visible",
          }}
        >
          <Tabs
            activeTab={currentTabRoute}
            onShowTab={(tabID: string) => {
              updateCurrentTabRoute(tabID);
            }}
            tabs={props}
            autoFocusContents={true}
          />
        </div>
      )}
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
