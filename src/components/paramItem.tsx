import { DropdownItem, PanelSectionRow, ToggleField,SliderField,showModal,ButtonItem } from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { RiArrowDownSFill, RiArrowUpSFill} from 'react-icons/ri';
import { ParamName, ParamPatchType, Settings } from "../util";
import { ParamData, ParamPatch } from "../util/interface";
import { SlowSliderField } from "./SlowSliderField";
import {TextInputModal} from "./TextInputModal";
import ResortableList from "./resortableList";
import { localizationManager, localizeStrEnum } from "../i18n";

const ParamPatchItem: VFC<{ paramName:ParamName, patchs: ParamPatch; patchIndex:number}> = ({ paramName,patchs,patchIndex}) => {
  
  const [selectedValue, setSelectedValue] = useState(Settings.getParamValue(paramName,patchIndex));
  const [selectedIndex, setSelectedIndex] = useState(patchs.args.indexOf(selectedValue));
  console.log(`initPatch ${paramName}`);
  function updateEvent(){
    console.log(`updateEvent ${paramName}`);
    var new_value=Settings.getParamValue(paramName,patchIndex);
    var new_index=patchs.args.indexOf(new_value);
    setSelectedValue(new_value);
    setSelectedIndex(new_index);
  }
  useEffect(()=>{
    Settings.settingChangeEventBus.addEventListener(paramName,updateEvent);
    return ()=>{
      Settings.settingChangeEventBus.removeEventListener(paramName,updateEvent);
      console.log(`removeUpdateEvent ${paramName}`);
    };
  },[])

  switch (patchs.type) {
    case ParamPatchType.slider:
      return (
        <>
          <PanelSectionRow>
            <SlowSliderField
              label={patchs.label}
              min={patchs.args[0]}
              max={patchs.args[1]}
              step={patchs.args[2]}
              showValue={true}
              value={selectedValue}
              bottomSeparator={"none"}
              onChangeEnd={(value) => {
                setSelectedValue(value);
                Settings.setParamValue(paramName,patchIndex,value);
              }}
            />
          </PanelSectionRow>
        </>
      );
    case ParamPatchType.notchSlider:
        return (
          <>
            <PanelSectionRow>
              <SliderField
                label={patchs.label}
                min={0}
                max={patchs.args.length-1}
                value={selectedIndex}
                bottomSeparator={"none"}
                notchCount={patchs.args.length}
                notchLabels={patchs.args.map((x, i) => {
                  return { notchIndex: i, label: x, value:i };
                })}
                onChange={(value) => {
                  setSelectedIndex(value);
                  Settings.setParamValue(paramName,patchIndex,patchs.args[value]);
                }}
              />
            </PanelSectionRow>
          </>
        );
    case ParamPatchType.dropdown:
      return (
        <>
          <PanelSectionRow>
            <DropdownItem
              label={patchs.label}
              rgOptions={patchs.args.map((x, i) => {
                  return { data: i, label: x }!!;
              })}
              selectedOption={selectedIndex}
              bottomSeparator={"none"}
              onChange={(index) => {
                setSelectedIndex(index.data);
                Settings.setParamValue(paramName,patchIndex,index.label);
              }}
            />
          </PanelSectionRow>
        </>
      );
      case ParamPatchType.textInput:
      return (
        <>
          <PanelSectionRow>
            <ButtonItem
            layout="below"
            bottomSeparator={"none"}
            onClick={() => {showModal(<TextInputModal OnConfirm={(text)=>{
              console.log(`text=${text}`);
              Settings.setParamValue(paramName,patchIndex,text);
            }} />)}}>
              {selectedValue}
            </ButtonItem>
          </PanelSectionRow>
        </>
      );
      case ParamPatchType.resortableList:
      return (
        <>
            <ResortableList title={localizationManager.getString(localizeStrEnum.PARAM_MANUALLY_SORT_TITLE)} initialArray={selectedValue.map((value: any)=>{
              return {label:patchs.args.filter((item)=>{ return value==item.value})?.[0]?.label??"not_find",value:value};
            })}
            onArrayChange={(newArray)=>{
              var value = newArray.map((item)=>{
                return item.value;
              })
              setSelectedValue(value);
              Settings.setParamValue(paramName,patchIndex,value);
            }}/>
        </>
      );
    default:
      return null;
  }
};

export const ParamItem: VFC<{ paramData: ParamData}> = ({paramData}) => {
      const [enable, setEnable] = useState(Settings.getParamEnable(paramData.name));
      const [visible,setVisible] = useState(Settings.getParamVisible(paramData.name));
      const [showPatch,setShowPatch] = useState(false);
      console.log(`initToggle ${paramData.name}`);
      const updateEvent=()=>{
        console.log(`updateToggleEvent ${paramData.name}`);
        //console.log(`enable=${enable} new_enable=${new_enable}`);
        setEnable(Settings.getParamEnable(paramData.name));
        setVisible(Settings.getParamVisible(paramData.name));
      }
      useEffect(()=>{
        Settings.settingChangeEventBus.addEventListener(paramData.name,updateEvent);
        return ()=>{
          Settings.settingChangeEventBus.removeEventListener(paramData.name,updateEvent);
          console.log(`removeUpdateToggleEvent ${paramData.name}`);
      }
      },[])
      return (
        visible?
        <>
          <PanelSectionRow>
            <ToggleField
              bottomSeparator={(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0?"none":"standard"}
              label={paramData.toggle.label?localizationManager.getString((paramData.toggle.label)as localizeStrEnum):undefined}
              description={paramData.toggle.description?localizationManager.getString((paramData.toggle.description)as localizeStrEnum):undefined}
              checked={enable}
              onChange={(enable) => {
                setEnable(enable);
                Settings.setParamEnable(paramData.name,enable);
              }}
            />
          </PanelSectionRow>
          {showPatch&&(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0 ? (
            <>
              {paramData.patchs?.map((e,patchIndex) => (
                <ParamPatchItem paramName={paramData.name} patchs={e} patchIndex={patchIndex}/>
              ))}
            </>
          ) : null}
          {(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0 &&
          <PanelSectionRow>
          <ButtonItem
              layout="below"
              style={{
                height:10,
              }}
              onClick={() => setShowPatch(!showPatch)}
                    >
                      {showPatch ? (
                        <RiArrowUpSFill
                          style={{ transform: "translate(0, -13px)", fontSize: "1.5em"}}
                        />
                      ) : (
                        <RiArrowDownSFill
                          style={{ transform: "translate(0, -12px)", fontSize: "1.5em"}}
                        />
                      )}
                    </ButtonItem>
          </PanelSectionRow>
          }
        </>:<></>
      );
};