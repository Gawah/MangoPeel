# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import asyncio
import os
import time
import logging
import subprocess
import ctypes
import struct
import sys
import threading
from ctypes import CDLL, get_errno
from threading import Thread, Timer

IN_ACCESS        = 0x00000001  # 文件被访问
IN_MODIFY        = 0x00000002  # 文件被修改
IN_ATTRIB       = 0x00000004    # 元数据改变
IN_CLOSE_WRITE   = 0x00000008  # 可写文件被关闭
IN_CLOSE_NOWRITE = 0x00000010  # 不可写文件被关闭
IN_OPEN          = 0x00000020  # 文件被打开
IN_MOVED_FROM    = 0x00000040  # 文件从X移动
IN_MOVED_TO      = 0x00000080  # 文件被移动到Y
IN_CREATE       = 0x00000100  # 子文件创建
IN_DELETE       = 0x00000200  # 子文件删除
IN_DELETE_SELF   = 0x00000400  # 自身（被监视的项本身）被删除
IN_MOVE_SELF     = 0x00000800  # 自身（被监视的项本身）被移动

STEAM_CONFIG=[
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nno_display",
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\npreset=0"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nframe_timing=0\ncpu_stats=0\ngpu_stats=0\nfps=1\nfps_only\nlegacy_layout=0\nwidth=40\nframetime=0",
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\npreset=1"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nlegacy_layout=0\nhorizontal\nbattery\ngpu_stats\ncpu_stats\ncpu_power\ngpu_power\nram\nfps\nframetime=0\nhud_no_margin\ntable_columns=14\nframe_timing=1",
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\npreset=2"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\ncpu_temp\ngpu_temp\nram\nvram\nio_read\nio_write\narch\ngpu_name\ncpu_power\ngpu_power\nwine\nframetime\nbattery",
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\npreset=3"
    ],
    [
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\nfull\ncpu_temp\ngpu_temp\nram\nvram\nio_read\nio_write\narch\ngpu_name\ncpu_power\ngpu_power\nwine\nframetime\nbattery",
        "control=mangohud\nmangoapp_steam\nfsr_steam_sharpness=5\nnis_steam_sharpness=10\npreset=4"
    ]
]

#日志配置
logging.basicConfig(
    level = logging.DEBUG,
    filename = "/tmp/MangoPeel.log",
    format="[%(asctime)s | %(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s",
    filemode = 'w',
    force = True
)

class Inotify:
    def __init__(self):
        try:
            self._libc = CDLL(None, use_errno=True)
            self._libc.inotify_init.argtypes = []
            self._libc.inotify_init.restype = ctypes.c_int
            self._libc.inotify_add_watch.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_uint32]
            self._libc.inotify_add_watch.restype = ctypes.c_int
            self._libc.inotify_rm_watch.argtypes = [ctypes.c_int, ctypes.c_int]
            self._libc.inotify_rm_watch.restype = ctypes.c_int

            self.fd = self._libc.inotify_init()

            self._wdMap = {}
            self._delay = 0.002
            self._delaytimer = None
            self._runThread = None
        except Exception as e:
             logging.error(e)

    def _process(self):
        try:
            if self._runThread:
                nowThread = self._runThread.name
            while self._runThread and self._runThread.name == nowThread:
                buf = os.read(self.fd, 4096)
                pos = 0
                wdMap = self._wdMap.copy()
                while pos < len(buf):
                    (wd, mask, cookie, name_len) = struct.unpack('iIII', buf[pos:pos + 16])
                    pos += 16
                    (name,) = struct.unpack('%ds' % name_len, buf[pos:pos + name_len])
                    pos += name_len
                    item = wdMap.get(wd)
                    if item and self._runThread and self._runThread.name == nowThread:
                        logging.debug(f"callback path:{item['path']}, mask:{mask}")
                        self._delayCall(item['callback'], item['path'], mask)
        except Exception as e:
             logging.error(e)

    def _delayCall(self, callfunc, *args):
        try:
            if self._delaytimer is not None and self._delaytimer.is_alive():
                self._delaytimer.cancel()
            self._delaytimer = Timer(self._delay, lambda: callfunc(*args))
            self._delaytimer.start()
        except Exception as e:
             logging.error(e)

    def add_watch(self, path, mask, callback):
        try:
            logging.debug(f"add_watch(self, path:{path}, mask:{mask}, callback:{callback})")
            path_buf = ctypes.create_string_buffer(path.encode(sys.getfilesystemencoding()))
            wd = self._libc.inotify_add_watch(self.fd, path_buf, mask)
            self._wdMap[wd] = {'path': path, 'callback': callback}
            if wd < 0:
                sys.stderr.write(f"can't add watch for {path_buf}: {os.strerror(get_errno())}\n")
            return wd
        except Exception as e:
             logging.error(e)

    def remove_watch(self, path):
        try:
            for wd in list(self._wdMap):
                if path == self._wdMap[wd]['path']:
                    if self._libc.inotify_rm_watch(self.fd, wd) < 0:
                        sys.stderr.write(f"can't remove watch: {os.strerror(get_errno())}\n")
                    else:
                        self._wdMap.pop(wd)
        except Exception as e:
             logging.error(e)

    def run(self):
        try:
            if self._runThread:
                pass
            else:
                self._runThread =  Thread(target=self._process)
                self._runThread.start()
        except Exception as e:
             logging.error(e)

    def stop(self):
        self._runThread = None

class MangoPeel:

    def process_IN_MODIFY(self, path, mask):
        logging.debug(f"process_IN_MODIFY path:{path} mask:{mask}")
        self.overWriteConfig()     #覆盖当前的配置

    def __init__(self):
        self._procPath=""    #proc路径
        self._appPid=""     #进程PID
        self._appcmdLine=""     #cmdline
        self._configPath=""      #mangoapp配置文件路径
        self._inotify = Inotify()
        self._setConfigList=["","","","",""]       #要设置的mangoapp配置
        self._steamIndex=-1
        self._bmangoapp_steam=True
        self._findConfig=False        #是否找到配置文件
        self._findInterval=2     #未找到配置时 间隔多久再找一次
        self._findCount=0   #当前找几次
        self._maxFindCount=3    #最多找几次
        

    def register(self):
        self.findConfigPath()   #加载文件路径
        self.overWriteConfig()     #覆盖当前的配置
        self._inotify.run()     #开启监控线程

    def unregister(self):
        self._inotify.stop()    #关闭监控线程


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
            if self._findCount + 1 < self._maxFindCount:
                self._findCount = self._findCount + 1
                return self.findConfigPath()
            else:
                self._findCount = 0
                return False
        appEnvs =  open(self._procPath + "/" +"environ", "r").read().strip()
        for appEnv in appEnvs.split("\0"):
            try:
                if appEnv.startswith("MANGOHUD_CONFIGFILE"):
                    self._configPath=appEnv.split("=")[1]
                    self._findConfig = True
                    self._inotify.add_watch(self._configPath, IN_MODIFY, self.process_IN_MODIFY)
                    logging.info(f"找到mangoapp配置路径 MANGOHUD_CONFIGFILE={self._configPath}")
                    return True
            except:
                continue
        return False
    
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
                for index in range(len(STEAM_CONFIG)):
                    if nowConfig in STEAM_CONFIG[index]:
                        self._steamIndex=index
                        self._bmangoapp_steam=True
                        logging.debug(f"识别到steam下标={self._steamIndex} 是否写入mangoapp_steam={self._bmangoapp_steam}")
                        break
                    for config in STEAM_CONFIG[index]:    
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
        self._mango.register()

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        self._mango.unregister()
        logging.info("End MangoPeel!")
        pass 
