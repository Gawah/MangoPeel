import { useEffect, useRef, useState } from 'react';
import { PanelSectionRow, Field } from 'decky-frontend-lib';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import { LocalizationManager, localizeStrEnum } from '../i18n';

const Arrow = ({ direction, show }: { direction: any, show: any }) => {
  return (
    show && (
      <span style={{ height: 20 }}>
        {direction === 'up' ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
      </span>
    )
  );
};

function ResortableList({
  initialArray,
  onArrayChange,
}: {
  initialArray: { label: string; value: string }[];
  onArrayChange: (newArray: { label: string; value: string }[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const currentIndexRef = useRef(currentIndex);
  const [items, setItems] = useState(initialArray);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    setItems(initialArray);
  }, [initialArray]);

  const handleSelectItem = (index: number) => {
    setCurrentIndex(currentIndex === index ? -1 : index);
  };

  const handleChangeItem = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex) {
      const newArray = [...items];
      [newArray[oldIndex], newArray[newIndex]] = [newArray[newIndex], newArray[oldIndex]];
      setItems(newArray);
      onArrayChange(newArray);
    }
  };

  const onItemFocus = (index: number) => {
    if (currentIndexRef.current >= 0) {
      handleChangeItem(currentIndexRef.current, index);
      setCurrentIndex(index);
    }
  };

  const onItemBlur = (index: number) => {
    setTimeout(() => {
      if (currentIndexRef.current === index) {
        setCurrentIndex(-1);
      }
    }, 50);
  };

  return (
    <>
      {items.map((item, index) => (
        <PanelSectionRow key={index}>
          <Field
            bottomSeparator="none"
            icon={
              <>
                <Arrow direction="up" show={currentIndex === index && index !== 0} />
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    textAlign: 'center',
                    color: '#000000',
                  }}
                >
                  {index + 1}
                </div>
                <Arrow
                  direction="down"
                  show={currentIndex === index && index !== items.length - 1}
                />
              </>
            }
            actionDescriptionMap={{
              1:currentIndex === index?LocalizationManager.getString(localizeStrEnum.RESORT_END_DESCRIPTION):LocalizationManager.getString(localizeStrEnum.RESORT_SELECT_DESCRIPTION),
              9:currentIndex === index && index !== 0?LocalizationManager.getString(localizeStrEnum.RESORT_MOVEUP_DESCRIPTION):undefined,
              10:currentIndex === index && index !== items.length - 1?LocalizationManager.getString(localizeStrEnum.RESORT_MOVEDOWN_DESCRIPTION):undefined,
            }}
            onActivate={() => handleSelectItem(index)}
            onGamepadFocus={() => onItemFocus(index)}
            onGamepadBlur={() => onItemBlur(index)}
          >
            <div style={{ width: 190, textAlign: 'center' }}>{item.label}</div>
          </Field>
        </PanelSectionRow>
      ))}
    </>
  );
}

export default ResortableList;