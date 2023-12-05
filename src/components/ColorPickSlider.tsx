
import Color from "color"
import { SlowSliderField } from "./SlowSliderField";
import { Focusable, PanelSectionRow } from "decky-frontend-lib";
import { useState } from "react";

interface ColorPickSliderProps {
  defaultValue?: string;
  OnConfirm: (text: string) => void;
}

export function ColorPickSlider({
  defaultValue = "FFFFFF",
  OnConfirm,
}: ColorPickSliderProps) {
  var [HSLValue,setHSLValue]=useState(Color(`#${defaultValue}`).hsl().array());
  return ( <>
  <PanelSectionRow id="MangoPeel_ColorPickSliderH">
    <SlowSliderField
      min={0}
      max={359}
      step={1}
      label={<div style={{ display: "flex", alignItems: "center",fontSize:11}}>
      <span>{`${Color.hsl(`hsl(${HSLValue[0]}, ${HSLValue[1]}%, ${HSLValue[2]}%)`).rgb().hex()}`}</span>
      <div
        style={{
          marginLeft: "54px",
          width: "20px",
          height: "20px",
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'absolute',
          marginBottom: "1px",
        }}
      >
        <div
          style={{
            backgroundColor: `${Color.hsl(`hsl(${HSLValue[0]}, ${HSLValue[1]}%, ${HSLValue[2]}%)`).rgb().hex()}`,
            width: "16px",
            height: "16px",
          }}
        />
      </div>
    </div>}
      layout={"inline"}
      bottomSeparator={"none"}
      onChange={(Hue) => {
        setHSLValue(Color.hsl(`hsl(${Hue}, ${HSLValue[1]}%, ${HSLValue[2]}%)`).array());
      } }
      onChangeEnd={(Hue) => {
        var rgb=Color.hsl(`hsl(${Hue}, ${HSLValue[1]}%, ${HSLValue[2]}%)`).rgb().hex();
        OnConfirm(rgb.replace("#", ""));
      } }
      value={HSLValue[0]}
      />
      </PanelSectionRow>
      <Focusable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',minHeight:40}}>
      <PanelSectionRow style={{ position: 'absolute', left: 0, zIndex: 1}} id="MangoPeel_ColorPickSliderS">
      <SlowSliderField 
      min={0}
      max={100}
      step={1}
      showValue={false}
      layout={"inline"}
      bottomSeparator={"none"}
      onChange={(Saturation) => {
        setHSLValue(Color.hsl(`hsl(${HSLValue[0]}, ${Saturation}%, ${HSLValue[2]}%)`).array());
      } }
      onChangeEnd={(Saturation) => {
        var rgb=Color.hsl(`hsl(${HSLValue[0]}, ${Saturation}%, ${HSLValue[2]}%)`).rgb().hex();
        OnConfirm(rgb.replace("#", ""));
      } }
      value={HSLValue[1]}
      />
      </PanelSectionRow>
      <PanelSectionRow style={{ position: 'absolute', right: 0, zIndex: 1}} id="MangoPeel_ColorPickSliderL">
      <SlowSliderField
      min={0}
      max={100}
      step={1}
      showValue={false}
      layout={"inline"}
      bottomSeparator={"none"}
      onChange={(Lightness) => { 
        setHSLValue(Color.hsl(`hsl(${HSLValue[0]}, ${HSLValue[1]}%, ${Lightness}%)`).array());
      } }
      onChangeEnd={(Lightness) => {
        var rgb=Color.hsl(`hsl(${HSLValue[0]}, ${HSLValue[1]}%, ${Lightness}%)`).rgb().hex();
        setHSLValue(Color.hsl(`hsl(${HSLValue[0]}, ${HSLValue[1]}%, ${Lightness}%)`).array());
        OnConfirm(rgb.replace("#", ""));
      } }
      value={HSLValue[2]}
      />
      </PanelSectionRow>
      </Focusable>
    
      <style>
            {
              //缩短滑动条
              `#MangoPeel_ColorPickSliderH
              .gamepaddialog_Field_S-_La.gamepaddialog_ChildrenWidthFixed_1ugIU 
              .gamepaddialog_FieldChildrenWithIcon_2ZQ9w{
                min-width: 180px!important;
              }
              .gamepaddialog_Field_S-_La.gamepaddialog_StandardPadding_XRBFu{
                --field-row-children-spacing:0px
              }
              
              #MangoPeel_ColorPickSliderS
              .gamepaddialog_Field_S-_La.gamepaddialog_ChildrenWidthFixed_1ugIU 
              .gamepaddialog_FieldChildrenWithIcon_2ZQ9w{
                min-width: 118px!important;
              }
              .gamepaddialog_Field_S-_La.gamepaddialog_StandardPadding_XRBFu{
                --field-row-children-spacing:0px
              }

              #MangoPeel_ColorPickSliderL
              .gamepaddialog_Field_S-_La.gamepaddialog_ChildrenWidthFixed_1ugIU 
              .gamepaddialog_FieldChildrenWithIcon_2ZQ9w{
                min-width: 118px!important;
              }
              .gamepaddialog_Field_S-_La.gamepaddialog_StandardPadding_XRBFu{
                --field-row-children-spacing:0px
              } 
              `
              
            }
            {
              //调整标签位置
              `#MangoPeel_ColorPickSliderS
              .gamepadslider_DescriptionValue_2oRwF {
                width: 43px;
                margin-left: 0;
                flex-direction: column;
              }
              #MangoPeel_ColorPickSliderL
              .gamepadslider_DescriptionValue_2oRwF {
                width: 43px;
                margin-left: 0;
                flex-direction: column;
              }`
            }
            {
              `#MangoPeel_ColorPickSliderH
              .gamepadslider_SliderTrack_Mq25N{
                background: linear-gradient(
                  to right,
                  hsl(0, ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(60,  ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(120,  ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(180,  ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(240,  ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(300,  ${HSLValue[1]}%, ${HSLValue[2]}%),
                  hsl(360,  ${HSLValue[1]}%, ${HSLValue[2]}%)
                ) !important;
                --left-track-color: #0000 !important;
                --colored-toggles-main-color: #0000 !important;
              }`
            }
            {
              `#MangoPeel_ColorPickSliderS
              .gamepadslider_SliderTrack_Mq25N{
                background: linear-gradient(
                  to right,
                  hsl(${HSLValue[0]}, 0%, ${HSLValue[2]}%),
                  hsl(${HSLValue[0]},  20%, ${HSLValue[2]}%),
                  hsl(${HSLValue[0]},  40%, ${HSLValue[2]}%),
                  hsl(${HSLValue[0]},  60%, ${HSLValue[2]}%),
                  hsl(${HSLValue[0]},  80%, ${HSLValue[2]}%),
                  hsl(${HSLValue[0]},  100%, ${HSLValue[2]}%)
                ) !important;
                --left-track-color: #0000 !important;
                --colored-toggles-main-color: #0000 !important;
              }`
            }
            {
              `#MangoPeel_ColorPickSliderL
              .gamepadslider_SliderTrack_Mq25N{
                background: linear-gradient(
                  to right,
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 0%),
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 20%),
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 40%),
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 60%),
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 80%),
                  hsl(${HSLValue[0]},  ${HSLValue[1]}%, 100%)
                ) !important;
                --left-track-color: #0000 !important;
                --colored-toggles-main-color: #0000 !important;
              }`
            }
          </style>
     </>
  );
}
