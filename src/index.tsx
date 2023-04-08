import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaBorderStyle } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {

  return (
    <div>正在开发中</div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi!.callPluginMethod<{},boolean>("ReloadConfigPath",{}).then(res=>{
    if (res.success){
      console.info("ReloadConfigPath = " + res.result);
    }
  })
  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaBorderStyle />,
    onDismount() {
    },
  };
});
