import { FC, useEffect, useRef, useState } from "react";
import { SliderField, SliderFieldProps } from "decky-frontend-lib";

export interface SlowSliderFieldProps extends SliderFieldProps {
  changeMin?: number;
  changeMax?: number;
  onChangeEnd?(value: number): void;
}

export const SlowSliderField: FC<SlowSliderFieldProps> = (slider) => {
  const [changeValue, setChangeValue] = useState<number>(slider.value);
  const isChanging = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (changeValue === slider.value && isChanging.current) {
        slider.onChangeEnd?.call(slider, slider.value);
        isChanging.current = false;
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [changeValue, slider.onChangeEnd, slider.value]);

  const handleChange = (value: number) => {
    let tpvalue = value;
    if (slider.changeMax !== undefined) {
      tpvalue = Math.min(tpvalue, slider.changeMax);
    }
    if (slider.changeMin !== undefined) {
      tpvalue = Math.max(tpvalue, slider.changeMin);
    }
    isChanging.current = true;
    slider.onChange?.call(slider, tpvalue);
    slider.value = tpvalue;
    setChangeValue(tpvalue);
  };

  return (
    <SliderField
      {...slider}
      value={slider.value}
      onChange={handleChange}
    />
  );
};

