import { findModuleChild } from "decky-frontend-lib";

export class prefStore{
    private static perfStore: any;
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
        this.perfStore?.SetPerfOverlayLevel(target)
        return true;
    }
}