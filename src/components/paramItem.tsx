import { DropdownItem, PanelSectionRow, ToggleField,SliderField,Field,DialogButton, showModal } from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { ParamName, ParamPatchType, Settings } from "../util";
import { ParamData, ParamPatch } from "../util/interface";
import { SlowSliderField } from "./SlowSliderField";
import {TextInputModal} from "./TextInputModal";

const ParamPatchItem: VFC<{ paramName:ParamName, patch: ParamPatch; patchIndex:number}> = ({ paramName,patch,patchIndex}) => {
  
  const [selectedValue, setSelectedValue] = useState(Settings.getParamValue(paramName,patchIndex));
  const [selectedIndex, setSelectedIndex] = useState(patch.args.indexOf(selectedValue));
  console.log(`initPatch ${paramName}`);
  function updateEvent(){
    console.log(`updateEvent ${paramName}`);
    var new_value=Settings.getParamValue(paramName,patchIndex);
    var new_index=patch.args.indexOf(new_value);
    if(selectedValue!=new_value)
      setSelectedValue(new_value);
    if(selectedIndex!=new_index)
      setSelectedIndex(new_index);
  }
  useEffect(()=>{
    Settings.settingChangeEventBus.addEventListener(paramName,updateEvent);
    return ()=>{
      Settings.settingChangeEventBus.removeEventListener(paramName,updateEvent);
      console.log(`removeUpdateEvent ${paramName}`);
    };
  },[])

  switch (patch.type) {
    case ParamPatchType.slider:
      return (
        <>
          <PanelSectionRow>
            <SlowSliderField
              label={patch.label}
              min={patch.args[0]}
              max={patch.args[1]}
              step={patch.args[2]}
              editableValue={patch.args[3]}
              showValue={true}
              value={selectedValue}
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
                label={patch.label}
                min={0}
                max={patch.args.length-1}
                value={selectedIndex}
                notchCount={patch.args.length}
                notchLabels={patch.args.map((x, i) => {
                  return { notchIndex: i, label: x, value:i };
                })}
                onChange={(value) => {
                  setSelectedIndex(value);
                  Settings.setParamValue(paramName,patchIndex,patch.args[value]);
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
                  return { data: i, label: x }!!;
              })}
              selectedOption={selectedIndex}
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
          <Field
          label={patch.label}
          description={patch.description}
          >
          <DialogButton onClick={() => {showModal(<TextInputModal bNumber={patch.args[0]} OnConfirm={(text)=>{
            console.log(`text=${text}`);
            Settings.setParamValue(paramName,patchIndex,text);
          }} />)}}>
            {selectedValue}
          </DialogButton>
        </Field>
          </PanelSectionRow>
        </>
      );
    default:
      return null;
  }
};

export const ParamItem: VFC<{ paramData: ParamData}> = ({paramData}) => {
      const [enable, setEnable] = useState(Settings.getParamEnable(paramData.name));
      const [visible,setVisible] = useState(Settings.getParamVisible(paramData.name));
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
              //bottomSeparator={bottomSeparatorValue}
              label={paramData.toggle.label}
              description={paramData.toggle.description}
              checked={enable}
              onChange={(enable) => {
                setEnable(enable);
                Settings.setParamEnable(paramData.name,enable);
              }}
            />
          </PanelSectionRow>
          {enable&&paramData.patch?.length > 0 ? (
            <>
              {paramData.patch?.map((e,patchIndex) => (
                <ParamPatchItem paramName={paramData.name} patch={e} patchIndex={patchIndex}/>
              ))}
            </>
          ) : null}
        </>:<></>
      );
};