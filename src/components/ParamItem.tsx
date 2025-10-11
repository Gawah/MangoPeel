import { DropdownItem, PanelSectionRow, ToggleField,SliderField,showModal,ButtonItem, Focusable } from "@decky/ui";
import { useEffect, useState, FC } from "react";
import { RiArrowDownSFill, RiArrowUpSFill} from 'react-icons/ri';
import { ParamName, ParamPatchType, ResortType, Settings } from "../util";
import { ParamData, ParamPatch } from "../util/interface";
import { SlowSliderField } from "./SlowSliderField";
import {TextInputModal} from "./TextInputModal";
import ResortableList from "./ResortableList";
import { LocalizationManager, localizeStrEnum } from "../i18n";
import { ColorPickSlider } from "./ColorPickSlider";

const ParamPatchItem: FC<{ paramName: ParamName, patch: ParamPatch; patchIndex: number}> = ({ paramName, patch, patchIndex}) => {

  const [selectedValue, setSelectedValue] = useState(Settings.getParamValue(Settings.getSettingsIndex(),paramName, patchIndex));
  const [selectedIndex, setSelectedIndex] = useState(patch.args.indexOf(selectedValue));
  useEffect(() => {
    const updateEvent = () => {
      const new_value = Settings.getParamValue(Settings.getSettingsIndex(),paramName, patchIndex);
      const new_index = patch.args.indexOf(new_value);
      setSelectedValue(new_value);
      setSelectedIndex(new_index);
    };
    Settings.settingChangeEventBus.addEventListener(paramName, updateEvent);
    return () => {
      Settings.settingChangeEventBus.removeEventListener(paramName, updateEvent);
    };
  }, []);

  const updateSettingsValue = (value: any) => {
    //setSelectedValue(value);
    Settings.setParamValue(Settings.getSettingsIndex(),paramName, patchIndex, value);
  };

  const resetParamDefault = ()=>{
    Settings.resetParamValueDefault(Settings.getSettingsIndex(),paramName,patchIndex);
  }

  switch (patch.type) {
    case ParamPatchType.slider:
      return (
        <>
          {/* @ts-ignore */}
          <PanelSectionRow id="MangoPeel_Slider">
              <SlowSliderField
              min={patch.args[0]}
              max={patch.args[1]}
              step={patch.args[2]}
              showValue={true}
              value={selectedValue}
              layout={"inline"}
              bottomSeparator={"none"}
              onChangeEnd={updateSettingsValue}
              resetValue={Settings.getDefaultParam(Settings.getSettingsIndex(),paramName)?.paramValues[patchIndex]}
              />
          </PanelSectionRow>
          <style>
            {
              //缩短滑动条
              `#MangoPeel_Slider
              .gamepaddialog_Field_S-_La.gamepaddialog_ChildrenWidthFixed_1ugIU 
              .gamepaddialog_FieldChildrenWithIcon_2ZQ9w{
                min-width: 215px!important;
              } `
            }
            {
              //调整标签位置
              `#MangoPeel_Slider 
              .gamepadslider_DescriptionValue_2oRwF {
                width: 43px;
                margin-left: 0;
                flex-direction: column;
              }`
            }
          </style>
        </>
      );
    case ParamPatchType.notchSlider:
      return (
        <>
          <PanelSectionRow>
            <SliderField
              label={patch.label}
              min={0}
              max={patch.args.length - 1}
              value={selectedIndex}
              bottomSeparator={"none"}
              notchCount={patch.args.length}
              notchLabels={patch.args.map((x: any, i: number) => {
                return { notchIndex: i, label: x, value: i };
              })}
              onChange={(value) => {
                setSelectedIndex(value);
                updateSettingsValue(patch.args[value]);
              }}
              resetValue={Settings.getDefaultParam(Settings.getSettingsIndex(),paramName)?.paramValues[patchIndex]}
            />
          </PanelSectionRow>
        </>
      );
    case ParamPatchType.dropdown:
      return (
        <>
          <PanelSectionRow>
          {/* @ts-ignore */}
          <Focusable  style={{ width: "100%", padding: 0, margin: 0, position: "relative" }}
              onSecondaryActionDescription={LocalizationManager.getString(localizeStrEnum.RESET_PARAM_DEFAULT)}
              onSecondaryButton={resetParamDefault}>
            <DropdownItem
              label={patch.label}
              rgOptions={patch.args.map((x: any, i: number) => {
                return { data: i, label: x };
              })}
              selectedOption={selectedIndex}
              bottomSeparator={"none"}
              onChange={(index) => {
                setSelectedIndex(index.data);
                updateSettingsValue(index.label);
              }}
            />
            </Focusable>
          </PanelSectionRow>
        </>
      );
    case ParamPatchType.textInput:
      return (
        <>
          <PanelSectionRow>
          {/* @ts-ignore */}
          <Focusable  style={{ width: "100%", padding: 0, margin: 0, position: "relative" }}
              onSecondaryActionDescription={LocalizationManager.getString(localizeStrEnum.RESET_PARAM_DEFAULT)}
              onSecondaryButton={resetParamDefault}>
            <ButtonItem
              layout="below"
              bottomSeparator={"none"}
              onClick={() => {
                showModal(
                  <TextInputModal
                    strTitle={patch.args?.[0]}
                    strDescription={patch.args?.[1]}
                    defaultValue={selectedValue}
                    OnConfirm={(text) => {
                      updateSettingsValue(text);
                    }}
                  />
                );
              }}
            >
              {selectedValue}
            </ButtonItem>
            </Focusable>
          </PanelSectionRow>
        </>
      );
    case ParamPatchType.resortableList:
      switch(patch.args[0]){
        case(ResortType.paramOrder):
          const [sortList,setsortList] = useState(Settings.getSortParamList(Settings.getSettingsIndex()));
          useEffect(() => {
            const updateEvent = () => {
              setsortList(Settings.getSortParamList(Settings.getSettingsIndex()));
            };
            Settings.settingChangeEventBus.addEventListener(paramName, updateEvent);
            return () => {
              Settings.settingChangeEventBus.removeEventListener(paramName, updateEvent);
            };
          }, []);
          return (
            <>
                <ResortableList initialArray={sortList.map((data)=>{
                  return {label: LocalizationManager.getString(data.toggle.label as localizeStrEnum),value:data.name};
                })}
                onArrayChange={(newArray)=>{
                  newArray.forEach((value,order)=>{
                    Settings.setParamOrder(Settings.getSettingsIndex(),value.value as ParamName,order + 1);
                  })
                }}/>
            </>
          );
        default:
          return <></>
      }
    case ParamPatchType.colorPicker:
      /*
      return <PanelSectionRow>
      <ButtonItem
        onClick={() =>
          showModal(
            <ColorPickModal
            defaultValue={selectedValue} 
            OnConfirm={(color)=>{
              updateSettingsValue(color);
            }}
            />
          )
        }
        layout={"below"}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>#{selectedValue}</span>
          <div
            style={{
              marginLeft: "auto",
              width: "24px",
              height: "24px",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: `#${selectedValue}`,
                width: "20px",
                height: "20px",
              }}
            />
          </div>
        </div>
      </ButtonItem>
    </PanelSectionRow>
    */
      return <ColorPickSlider value={selectedValue} resetValue={Settings.getDefaultParam(Settings.getSettingsIndex(),paramName)?.paramValues[patchIndex]}
        OnConfirm={(color)=>{
          updateSettingsValue(color);
        }}/>
      default:
      return null;
  }
};

export const ParamItem: FC<{ paramData: ParamData}> = ({paramData}) => {
      const [enable, setEnable] = useState(Settings.getParamEnable(Settings.getSettingsIndex(),paramData.name as ParamName));
      const [visible,setVisible] = useState(Settings.getParamVisible(Settings.getSettingsIndex(),paramData.name as ParamName));
      const [showPatch,setShowPatch] = useState(false);
      const [showArrawItem,setShowArrawItem] = useState(true);
      const updateEvent=()=>{
        //console.log(`enable=${enable} new_enable=${new_enable}`);
        setEnable(Settings.getParamEnable(Settings.getSettingsIndex(),paramData.name as ParamName));
        setVisible(Settings.getParamVisible(Settings.getSettingsIndex(),paramData.name as ParamName));
        
        //当排序参数数量为0时需要隐藏箭头按钮
        if(paramData.name == ParamName.legacy_layout){
          setShowArrawItem(Settings.getSortParamCount(Settings.getSettingsIndex())>0);
        }
      }
      useEffect(()=>{
        updateEvent();
        Settings.settingChangeEventBus.addEventListener(paramData.name,updateEvent);
        return ()=>{
          Settings.settingChangeEventBus.removeEventListener(paramData.name,updateEvent);
      }
      },[])
      return (
        visible?
        <>
          <PanelSectionRow>
            <ToggleField
              bottomSeparator={(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0?"none":"standard"}
              label={paramData.toggle.label?LocalizationManager.getString((paramData.toggle.label)as localizeStrEnum):undefined}
              description={paramData.toggle.description?LocalizationManager.getString((paramData.toggle.description)as localizeStrEnum):undefined}
              checked={enable}
              onChange={(enable) => {
                setEnable(enable);
                Settings.setParamEnable(Settings.getSettingsIndex(),paramData.name,enable);
              }}
            />
          </PanelSectionRow>
          {showPatch&&(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0 ? (
            <>
              {paramData.patchs?.map((e: ParamPatch, patchIndex: number) => (
                 <ParamPatchItem paramName={paramData.name} patch={e} patchIndex={patchIndex}/>
              ))}
            </>
          ) : null}
          {showArrawItem&&(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0&&
          <PanelSectionRow>
          <ButtonItem
              layout="below"
              // @ts-ignore
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