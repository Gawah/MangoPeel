# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin
import asyncio
import os
import time
import logging
import pyinotify
import subprocess
from helpers import get_user
steam_config=[
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nno_display",
        "preset=0"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nframe_timing=0\ncpu_stats=0\ngpu_stats=0\nfps=1\nfps_only\nlegacy_layout=0\nwidth=40\nframetime=0",
        "preset=1"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nlegacy_layout=0\nhorizontal\nbattery\ngpu_stats\ncpu_stats\ncpu_power\ngpu_power\nram\nfps\nframetime=0\nhud_no_margin\ntable_columns=14\nframe_timing=1",
        "preset=2"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\ncpu_temp\ngpu_temp\nram\nvram\nio_read\nio_write\narch\ngpu_name\ncpu_power\ngpu_power\nwine\nframetime\nbattery",
        "preset=3"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nfull\ncpu_temp\ngpu_temp\nram\nvram\nio_read\nio_write\narch\ngpu_name\ncpu_power\ngpu_power\nwine\nframetime\nbattery",
        "preset=4"
    ]
]

#日志配置
try:
    LOG_LOCATION = "/tmp/MangoPeel.log"
    logging.basicConfig(
        level = logging.DEBUG,
        filename = LOG_LOCATION,
        format="[%(asctime)s | %(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s",
        filemode = 'w',
        force = True)
except Exception as e:
    logging.error(f"日志配置异常|{e}")

class MangoPeel:
    class ConfigEventHandler(pyinotify.ProcessEvent):
        def __init__(self,mangoapp):
            self._mangoapp=mangoapp

        def process_IN_MODIFY(self, event):
            self._mangoapp.overWriteConfig()     #覆盖当前的配置

    def __init__(self):
        self._procPath=""    #proc路径
        self._appPid=""     #进程PID
        self._appcmdLine=""     #cmdline
        self._configPath=""      #mangoapp配置文件路径
        self._configMonitor = pyinotify.WatchManager()  #配置监视
        self._setConfigList=["","","","",""]       #要设置的mangoapp配置
        self._steamIndex=-1
        self._bmangoapp_steam=True
        self._findConfig=False        #是否找到配置文件
        self._findInterval=2     #未找到配置时 间隔多久再找一次

        self.findConfigPath()   #加载文件路径
        self.overWriteConfig()     #覆盖当前的配置
        self._registerConfigNotifier()  #注册文件监听

    def findConfigPath(self):
        procPath="/proc"
        findCmd=False
        for procdir in os.listdir(procPath):
            try:
                if os.path.isdir(procPath + "/" + procdir):
                    appPid = int(procdir)
                    appProcPath = procPath + "/" + procdir
                    appCmdLine = open(appProcPath + "/" +"cmdline", "r").read().strip()
                if appCmdLine.startswith("mangoapp"):
                    self._procPath = appProcPath
                    self._appPid = appPid
                    self._appcmdLine = appCmdLine
                    logging.info(f"找到mangoapp配置项 appPid={appPid} appCmdLine={appCmdLine} ")
                    findCmd=True
                    break
            except:
                continue
        if not findCmd:
            logging.error(f"未找到mangoapp配置路径={self._configPath}")
            time.sleep(self._findInterval)
            return self.findConfigPath()
        appEnvs =  open(self._procPath + "/" +"environ", "r").read().strip()
        for appEnv in appEnvs.split("\0"):
            try:
                if appEnv.startswith("MANGOHUD_CONFIGFILE"):
                    self._configPath=appEnv.split("=")[1]
                    self._findConfig = True
                    self._configMonitor.add_watch(self._configPath, pyinotify.IN_MODIFY, rec=True)
                    logging.info(f"找到mangoapp配置路径 MANGOHUD_CONFIGFILE={self._configPath}")
                    return True
            except:
                continue
        return False

    def _registerConfigNotifier(self):
        try:
            if(not self._findConfig):
                return
            notifier = pyinotify.ThreadedNotifier(self._configMonitor, MangoPeel.ConfigEventHandler(self))
            notifier.start()
        except Exception as e:
            logging.error(e)
    
    def getSteamIndex(self):
        try:
            if(self._steamIndex<0):
                return 0
            return self._steamIndex
        except Exception as e:
            logging.error(e)

    def setOverwriteConfigs(self,configs:list):
        if not self._findConfig:
            return
        for index in range(len(self._setConfigList)):
            try:
                self._setConfigList[index] = configs[index]
            except:
                continue

    def setOverwriteConfig(self,index:int,config:str):
        if not self._findConfig:
            return
        try:
            if index >= len(self._setConfigList) or index < 0:
                logging.error(f"非法的configs下标：{index}")
                return
            self._setConfigList[index]=config
        except Exception as e:
            logging.error(e)

    def overWriteConfig(self):
        try:
            if not self._findConfig:
                return
            nowConfig = open(self._configPath, "r").read().strip()
            #没有mangopeel的标签 则查找是否是steam写入的配置 并记录下标
            if not nowConfig.startswith("mangopeel_flag"):
                for index in range(len(steam_config)):
                    if nowConfig in steam_config[index]:
                        self._steamIndex=index
                        self._bmangoapp_steam=True
                        logging.debug(f"识别到steam下标={self._steamIndex} 是否写入mangoapp_steam={self._bmangoapp_steam}")
                        break
                    for config in steam_config[index]:    
                        if config.replace("mangoapp_steam\n","") == nowConfig:
                            self._steamIndex=index
                            self._bmangoapp_steam=False
                            logging.debug(f"识别到steam下标={self._steamIndex} 是否写入mangoapp_steam={self._bmangoapp_steam}")
                            break
            if not self._findConfig or self._steamIndex<0 or self._setConfigList[self._steamIndex] == "":
                return
            if self._bmangoapp_steam:
                writeStr = ("mangopeel_flag\nmangoapp_steam\n" + self._setConfigList[self._steamIndex])
            else:
                writeStr = "mangopeel_flag\n" + self._setConfigList[self._steamIndex]

            if writeStr.replace("\n","")!= nowConfig.replace("\n",""):
                open(self._configPath, "w").write(writeStr)
                logging.debug(f"写入配置 steam下标={self._steamIndex} 配置为:\n{writeStr}")
        except Exception as e:
            logging.error(e)


class Plugin:

    async def ReloadConfigPath(self):
        try:
            if self._mango.findConfigPath():
                self._mango.overWriteConfig()
                return True
            return False
        except Exception as e:
            logging.info(e)
            return False
    
    async def SetOverwriteConfig(self,index:int,config:str):
        try:
            logging.debug(f"index = {index} config={config}")
            if self._mango.findConfigPath():
                self._mango.setOverwriteConfig(index,config)
                self._mango.overWriteConfig()
                return True
            return False
        except Exception as e:
            logging.error(e)
            return False
    
    async def SetOverwriteConfigs(self,configs:list):
        try:
            logging.debug(f"configs={configs}")
            if self._mango.findConfigPath():
                self._mango.setOverwriteConfigs(configs)
                self._mango.overWriteConfig()
                return True
            return False
        except Exception as e:
            logging.error(e)
            return False

    async def get_language(self):
        try:
            lang_path=f"/home/{get_user()}/.steam/registry.vdf"
            if os.path.exists(lang_path):
                command="cat {}|grep language|sed -n '1p'|xargs|cut  -d \" \" -f  2".format(lang_path)
                language=subprocess.getoutput(command)
            else:
                language="english"
                logging.error(f"語言檢測路徑{lang_path}不存在該文件")
            logging.info(f"get_language {language} path={lang_path}")
            return language
        except Exception as e:
            logging.error(e)
            return "english"
    
    async def get_steamIndex(self):
        try:
            index = self._mango.getSteamIndex()
            logging.debug(f"get_steamIndex {index}")
            return index
        except Exception as e:
            logging.error(e)
            return 0
    
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        logging.info("Running MangoPeel!")
        self._mango=MangoPeel()

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        logging.info("End MangoPeel!")
        pass 

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        logging.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        #decky_plugin.migrate_logs(os.path.join("/tmp/MangoPeel.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        #decky_plugin.migrate_settings(
        #    os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
        #    os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        #decky_plugin.migrate_runtime(
        #    os.path.join(decky_plugin.DECKY_HOME, "template"),
        #    os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))
