import {
  NotchLabel,
  PanelSectionRow,
  SliderField
} from "decky-frontend-lib";
import {useState, VFC} from "react";
import { localizeStrEnum,localizationManager} from "../i18n";
import { Settings } from "../util";

const mangIndexLabelList: NotchLabel[] | undefined=[
  {notchIndex: 0,label:localizationManager.getString(localizeStrEnum.MANGOINDEX_LABEL_CLOSE),value:0},
  {notchIndex: 1,label:"1",value:1},
  {notchIndex: 2,label:"2",value:2},
  {notchIndex: 3,label:"3",value:3},
  {notchIndex: 4,label:"4",value:4}
]

export const MangoIndex: VFC = () => {
  const [selectedValue, setValue] = useState(Settings.getSettingsIndex());
  return (
        <div>
          <PanelSectionRow>
            <SliderField
              label={localizationManager.getString(localizeStrEnum.MANGOINDEX_LABEL)}
              min={0}
              max={4}
              step={1}
              notchLabels={mangIndexLabelList}
              notchCount={mangIndexLabelList.length}
              value={selectedValue}
              onChange={(value) => {
                setValue(value);
                Settings.setSettingsIndex(value);
              }}
            />
          </PanelSectionRow>
        </div>
    );
};

