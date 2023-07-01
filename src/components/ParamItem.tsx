import { DropdownItem, PanelSectionRow, ToggleField,SliderField,showModal,ButtonItem } from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { RiArrowDownSFill, RiArrowUpSFill} from 'react-icons/ri';
import { ParamName, ParamPatchType, Settings } from "../util";
import { ParamData, ParamPatch } from "../util/interface";
import { SlowSliderField } from "./SlowSliderField";
import {TextInputModal} from "./TextInputModal";
import ResortableList from "./ResortableList";
import { LocalizationManager, localizeStrEnum } from "../i18n";

const ParamPatchItem: VFC<{ paramName: ParamName, patch: ParamPatch; patchIndex: number }> = ({ paramName, patch, patchIndex }) => {

  const [selectedValue, setSelectedValue] = useState(Settings.getParamValue(paramName, patchIndex));
  const [selectedIndex, setSelectedIndex] = useState(patch.args.indexOf(selectedValue));

  useEffect(() => {
    const updateEvent = () => {
      const new_value = Settings.getParamValue(paramName, patchIndex);
      const new_index = patch.args.indexOf(new_value);
      setSelectedValue(new_value);
      setSelectedIndex(new_index);
    };
    Settings.settingChangeEventBus.addEventListener(paramName, updateEvent);
    return () => {
      Settings.settingChangeEventBus.removeEventListener(paramName, updateEvent);
    };
  }, []);

  const updateSelectedValue = (value: any) => {
    setSelectedValue(value);
    Settings.setParamValue(paramName, patchIndex, value);
  };

  switch (patch.type) {
    case ParamPatchType.slider:
      return (
        <>
          <PanelSectionRow id="MangoPeel_Slider">
            <SlowSliderField
              min={patch.args[0]}
              max={patch.args[1]}
              step={patch.args[2]}
              showValue={true}
              value={selectedValue}
              layout={"inline"}
              bottomSeparator={"none"}
              onChangeEnd={updateSelectedValue}
            />
          </PanelSectionRow>
          <style>
            {
              //缩短滑动条
              `#MangoPeel_Slider 
              .gamepaddialog_Field_S-_La.gamepaddialog_ChildrenWidthFixed_1ugIU 
              .gamepaddialog_FieldChildren_14_HB{
                min-width:215px
              }`
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
              notchLabels={patch.args.map((x, i) => {
                return { notchIndex: i, label: x, value: i };
              })}
              onChange={(value) => {
                setSelectedIndex(value);
                updateSelectedValue(patch.args[value]);
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
              label={patch.label}
              rgOptions={patch.args.map((x, i) => {
                return { data: i, label: x };
              })}
              selectedOption={selectedIndex}
              bottomSeparator={"none"}
              onChange={(index) => {
                setSelectedIndex(index.data);
                updateSelectedValue(index.label);
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
              onClick={() => {
                showModal(
                  <TextInputModal
                    strTitle={patch.args?.[0]}
                    strDescription={patch.args?.[1]}
                    defaultValue={selectedValue}
                    OnConfirm={(text) => {
                      updateSelectedValue(text);
                    }}
                  />
                );
              }}
            >
              {selectedValue}
            </ButtonItem>
          </PanelSectionRow>
        </>
      );
    case ParamPatchType.resortableList:
      return (
        <>
            <ResortableList initialArray={selectedValue.map((value: any)=>{
              return {label:patch.args.filter((item)=>{ return value==item.value})?.[0]?.label??"not_find",value:value};
            })}
            onArrayChange={(newArray)=>{
              var value = newArray.map((item)=>{
                return item.value;
              })
              updateSelectedValue(value);
            }}/>
        </>
      );
    default:
      return null;
  }
};

export const ParamItem: VFC<{ paramData: ParamData}> = ({paramData}) => {
      const [enable, setEnable] = useState(Settings.getParamEnable(paramData.name as ParamName));
      const [visible,setVisible] = useState(Settings.getParamVisible(paramData.name as ParamName));
      const [showPatch,setShowPatch] = useState(false);
      const updateEvent=()=>{
        //console.log(`enable=${enable} new_enable=${new_enable}`);
        setEnable(Settings.getParamEnable(paramData.name as ParamName));
        setVisible(Settings.getParamVisible(paramData.name as ParamName));
      }
      useEffect(()=>{
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
                Settings.setParamEnable(paramData.name,enable);
              }}
            />
          </PanelSectionRow>
          {showPatch&&(paramData.toggle.isShowPatchWhenEnable??true)==enable&&paramData.patchs?.length > 0 ? (
            <>
              {paramData.patchs?.map((e,patchIndex) => (
                <ParamPatchItem paramName={paramData.name} patch={e} patchIndex={patchIndex}/>
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