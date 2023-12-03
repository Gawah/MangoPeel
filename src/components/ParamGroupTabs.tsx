import { Field, Focusable, PanelSectionRow } from 'decky-frontend-lib';
import React, { createElement, useEffect, useRef, useState } from 'react';



const L1Icon = createElement("img", {
  src: "/steaminputglyphs/sd_l1.svg"
})

const R1ICON = createElement("img", {
  src: "/steaminputglyphs/sd_r1.svg"
})
interface TabProp {
  label: string; 
  Node: React.ReactNode;
}

interface TabProps {
  props?:TabProp[]
}
const Tab: React.FC<TabProps> = (tab:TabProps) => {
  const [activeIndex, setActiveIndex] = useState(0); // 当前选中的Tab索引
  const [activeTab, setActiveTab] = useState(tab.props?.[activeIndex]?.label); // 当前选中的Tab
  const containerRef = useRef<HTMLDivElement>(null);
  const scorllIndexRef = useRef<number>(activeIndex);
  const L1StateRef =  useRef<boolean>(false);
  const R1StateRef =  useRef<boolean>(false);
  const [buttonPress,setButtonPress] = useState<number>(0);
  const tabRef = useRef<TabProps>(tab);
  const scrollToField = (index: number) => {
    var vaildIndex = Math.max(0,Math.min(index,(tabRef.current.props?.length??0)-1))
    setActiveIndex(vaildIndex);
    setActiveTab(tabRef.current.props?.[vaildIndex]?.label)
    scorllIndexRef.current = vaildIndex;
    if (containerRef.current&&index==vaildIndex) {
      const childrenArray = Array.from(containerRef.current.children);
      const targetElement = childrenArray[index] as HTMLDivElement;
      containerRef.current.scrollLeft = targetElement.offsetLeft - containerRef.current.offsetLeft - 25;
    }
  };
  useEffect(()=>{
    var handleButtonInput = async (val: any[]) => {
      /*
      R1 2 L1 3
      R2 0 L2 1
      Y  4 B  5 X  6 A  7
      UP 8 Right 9 Left 10 Down 11
      Select 12 Start 14
      Steam 13 
      */
      for (const inputs of val) {
        //按下标记
        if (inputs.ulButtons && inputs.ulButtons & (1 << 2)) {
          R1StateRef.current = true;
          setButtonPress(2);
        }
        else if(inputs.ulButtons && inputs.ulButtons & (1 << 3)) {
          L1StateRef.current = true;
          setButtonPress(1);
        }
        //松开触发事件
        if(R1StateRef.current && !(inputs.ulButtons & (1 << 2))){
          R1StateRef.current = false;
          scrollToField(scorllIndexRef.current+1);
          setTimeout(() => {
            setButtonPress(0);
          }, 100);
        }else if(L1StateRef.current && !(inputs.ulButtons & (1 << 3))){
          L1StateRef.current = false;
          scrollToField(scorllIndexRef.current-1);
          setTimeout(() => {
            setButtonPress(0);
          }, 100);
        }
      }
    }
    let input_register = window.SteamClient.Input.RegisterForControllerStateChanges(handleButtonInput);
    return (()=>{
      input_register.unregister();
    })
  },[])
  useEffect(()=>{
    tabRef.current = tab;
    //页数发生变化时重新定位
    if(tab?.props?.[activeIndex]?.label!=activeTab){
        var isRefind = false;
        for (const [index,prop] of tab.props?.entries()??[]) {
          if(prop.label == activeTab){
            isRefind = true;
            setActiveIndex(index);
            scrollToField(index);
            break;
          }
        }
        if(!isRefind){
          setActiveIndex(0);
        }
      }
  },[tab])
  return (
    <div>
    <PanelSectionRow>
      <Focusable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{ position: 'absolute', left: 0, zIndex: 1,opacity:buttonPress==1?1:0.5}}>
          <Field icon={L1Icon} bottomSeparator={"none"}></Field>
        </div>

        <div ref={containerRef} style={{ display: '-webkit-inline-box', overflow:"scroll", width:180}}>
          {tab.props?.map((prop, index) => (
            <Field
              key={prop.label}
              label={<div style={{
                fontWeight: activeIndex === index ? 'bold' : 'normal',
                fontSize: activeIndex === index ? '1.1em' : '0.9em',
                color:activeIndex === index ? '#ffffff':'#3d4450',
                padding: '10px',
                textAlign: 'center',
              }}>{prop.label}</div>}   
              bottomSeparator={"none"}
              highlightOnFocus={false}
            >
            </Field>
          ))}
        </div>

        <div style={{ position: 'absolute', right: -10, zIndex: 1 ,opacity:buttonPress==2?1:0.5}}>
          <Field icon={R1ICON} bottomSeparator={"none"}></Field>
        </div>
      </Focusable>
    </PanelSectionRow>
    <div key={tab.props?.[activeIndex]?.label}>
    {tab.props?.[activeIndex]?.Node}
    </div>
  </div>
  );
};

export default Tab;
