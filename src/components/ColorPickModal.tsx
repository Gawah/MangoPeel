import { ColorPickerModal} from "decky-frontend-lib";
import Color from "color"

interface ColorPickModalProps {
  closeModal?: () => void;
  title?: string;
  defaultValue?: string;
  OnConfirm: (text: string) => void;
}

export function ColorPickModal({
  closeModal,
  title = "Color Picker",
  defaultValue = "FFFFFF",
  OnConfirm,
}: ColorPickModalProps) {
  var HSLValue=Color(`#${defaultValue}`).hsl().array();
  return (
    <>
    <ColorPickerModal
      onConfirm={(HSLString) => {
        var rgb= Color.hsl(HSLString).rgb().hex();
        OnConfirm(rgb.replace("#", ""));
        closeModal?.();
      } }
      defaultH={HSLValue[0]}
      defaultS={HSLValue[1]}
      defaultL={HSLValue[2]}
      defaultA={HSLValue[3]??1}
      title={title}
      closeModal={()=>{
        closeModal?.();
      }} 
      />
    </>
  );
}
