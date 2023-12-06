import { findModuleChild, sleep } from "decky-frontend-lib";
import { Backend } from "./backend";

export class prefStore{
    private static perfStore: any;
    //private static disableCallBack: number;
    public static async init(){
        try{
            var perfStoreClass;
            var count = 0;
            while(!this.perfStore){
                perfStoreClass = findModuleChild((m: any) => {
                    if (typeof m !== "object") return undefined;
                    for (let prop in m) {
                      if (m[prop]?.prototype?.SetFPSLimit) return m[prop];
                    }
                  });
                this.perfStore = perfStoreClass?.Get();
                await sleep(100);
                count++;
                if(count>=10){
                    console.error("获取perfStore失败")
                }
            }
        }catch(e){
            console.error(e)
        }

    }

    public static getPerfStore(){
        return this.perfStore
    }

    public static getSteamIndex(){
        if(!this.perfStore||this.perfStore?.msgSettingsGlobal?.perf_overlay_level==undefined){
            return -1;
        }
        switch(this.perfStore?.msgSettingsGlobal?.perf_overlay_level){
            case(0):
                return 0;
            case(4):
                return 1;
            case(1):
                return 2;
            case(2):
                return 3;
            case(3):
                return 4;
            default:
                return -1;
        }
    }

    public static setSteamIndex(index:number){
        if(!this.perfStore||!this.perfStore?.SetPerfOverlayLevel){
            return false;
        }
        var target=0;
        switch(index){
            case(0):
                target = 0;
                break;
            case(1):
                target = 4;
                break;
            case(2):
                target = 1;
                break;
            case(3):
                target = 2;
                break;
            case(4):
                target = 3;
                break;
            default:
                return false;
        }
        //this.disableCallBack++;
        //setTimeout(()=>{
        //    this.disableCallBack--;
        //},1000)
        try{
            this.perfStore?.SetPerfOverlayLevel(target);
        }catch{
            return false;
        }
        return true;
    }

    public static async trySetSteamIndex(index:number,tryCount:number){
        var result=false;
        var count = 0;       
        while(!result&&count<tryCount){
            count++;
            if(!this.perfStore||!this.perfStore?.SetPerfOverlayLevel){
                result=false;
                sleep(100);
                continue;
            }
            var target=0;
            switch(index){
                case(0):
                    target = 0;
                    break;
                case(1):
                    target = 4;
                    break;
                case(2):
                    target = 1;
                    break;
                case(3):
                    target = 2;
                    break;
                case(4):
                    target = 3;
                    break;
                default:
                    return false;
            }
            //this.disableCallBack++;
            //setTimeout(()=>{
            //    this.disableCallBack--;
            //},1000)
            try{
                this.perfStore?.SetPerfOverlayLevel(target);
                result=true;
                break;
            }catch{
                result=false;
                sleep(100);
                continue;
            }
        }
        return result;
    }


    // 改为存储一个回调函数的列表
    private static overlayLevelListeners: ((newValue: number) => void)[] = [];
    private static overlayLevelIntervalID: any = null;
    private static lastKnownOverlayLevel: number | undefined = undefined;

    // 注册监听函数
    public static registerOverlayLevelListener(callback: (newValue: number) => void) {
        // 将新的回调添加进列表
        this.overlayLevelListeners.push(callback);
        // 设置初始值（如果尚未设置）
        if (this.lastKnownOverlayLevel === undefined) {
            this.lastKnownOverlayLevel = this.getSteamIndex();
        }
        // 如果定时器已经在运行，则不需要再次设置
        if (this.overlayLevelIntervalID !== null) {
            return;
        }
        // 设立定时器以周期性检查属性的变化
        this.overlayLevelIntervalID = setInterval(() => {
            var currentLevel = this.getSteamIndex();
            //获取到-1时，prefstore由于各种原因失效，使用python后端获取下标
            if (currentLevel==-1){
                //使用后端获取值并比较下标
                Backend.getSteamIndex().then((nowIndex)=>{
                    currentLevel = nowIndex;
                    if (this.lastKnownOverlayLevel !== currentLevel) {
                        // 检测到变化，通知所有回调函数
                        this.overlayLevelListeners.forEach((listener) => {
                            //if(!this.disableCallBack){
                                listener(currentLevel);
                            //}
                        });
                        this.lastKnownOverlayLevel = currentLevel; // 更新最后已知值
                    }
                })
            }
            else if (this.lastKnownOverlayLevel !== currentLevel) {
                // 检测到变化，通知所有回调函数
                this.overlayLevelListeners.forEach((listener) => {
                    //if(!this.disableCallBack){
                        listener(currentLevel);
                    //}
                });
                this.lastKnownOverlayLevel = currentLevel; // 更新最后已知值
            }
        }, 200); // 检查频率为200毫秒，根据需要调整
    }

    // 移除监听函数
    public static removeOverlayLevelListener(callback: (newValue: number) => void) {
        // 从回调列表中移除指定的回调函数
        this.overlayLevelListeners = this.overlayLevelListeners.filter(listener => listener !== callback);
        // 如果没有更多的监听器，清除定时器
        if (this.overlayLevelListeners.length === 0 && this.overlayLevelIntervalID) {
            clearInterval(this.overlayLevelIntervalID);
            this.overlayLevelIntervalID = null;
        }
    }
}