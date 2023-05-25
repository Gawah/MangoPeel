import { useEffect, useRef, useState } from 'react';
import { PanelSectionRow, Field,} from 'decky-frontend-lib';
import { RiArrowDownSFill, RiArrowUpSFill} from 'react-icons/ri';

const Arrow = ({direction, show }:{direction:any, show:any }) => {
  if (!show) {
    return null;
  }
  return (
    <span style={{ height:20 }}>
      {direction === 'up' ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
    </span>
  );
};

function ResortableList({
    title,
    initialArray,
    onArrayChange,
  }: {
    title:string,
    initialArray:{label:string,value:string}[],
    onArrayChange:(newArray:{label:string,value:string}[])=>void,
  }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const currentIndexRef = useRef(currentIndex);
  const [items, setItems] = useState(initialArray);
  
  useEffect(()=>{
    currentIndexRef.current = currentIndex;
  },[currentIndex])
  useEffect(() => {
    setItems(initialArray);
  }, [initialArray]);
  const handleSelectItem = (index:number) => {
    if (currentIndex === index) {
      setCurrentIndex(-1);
    } else {
      setCurrentIndex(index);
    }
  };

  const handleChangeItem = (oldIndex:number,newIndex:number) => {
    if(oldIndex!=newIndex){
      var newArray = items.slice();
      var temp = newArray[newIndex];
      newArray[newIndex] = newArray[oldIndex];
      newArray[oldIndex] = temp;
      setItems(newArray);
      onArrayChange(newArray);
    }
  }

  const onItemFocus = (index:number)=>{
    if(currentIndexRef.current>=0){
      handleChangeItem(currentIndexRef.current,index);
      setCurrentIndex(index);
    }
  }
  const onItemBlur = (index:number)=>{
    setTimeout(()=>{
      if(currentIndexRef.current==index){
        setCurrentIndex(-1);
      }
    },50)
  }

  return (
    <>
      <PanelSectionRow>
        <Field bottomSeparator={"none"}
        label={
            <div style={{
                  width:"100%",
                  textAlign:"center",
            }}>
            {title}
          </div>
        }
        >
        </Field>
      </PanelSectionRow>
      {items.map((item, index) => (
        <PanelSectionRow key={index}>
              <Field
              bottomSeparator={index==items.length-1?"standard":"none"}
              icon={
              <>
                <Arrow direction="up" show={currentIndex == index && index != 0} />
                  <div style={{
                    backgroundColor:"#ffffff",
                    width:20,
                    height:20,
                    borderRadius:30,
                    textAlign:"center",
                    color:"#000000",
                  }}>{index+1}</div>
                  <Arrow direction="down" show={currentIndex == index && index != items.length - 1} />
              </>}
              highlightOnFocus={true}
              onActivate={() => handleSelectItem(index)}
              onGamepadFocus={()=>onItemFocus(index)}
              onGamepadBlur={()=>onItemBlur(index)}
              >
              <div style={{
                width:190,
                textAlign:"center",
              }}>{item.label}</div>
              </Field>
        </PanelSectionRow>
      ))}
    </>
  );
};
export default ResortableList;