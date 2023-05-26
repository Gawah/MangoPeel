import { ConfirmModal, TextField } from "decky-frontend-lib";
import { useState } from "react";
import { localizationManager, localizeStrEnum } from "../i18n";

export function TextInputModal({
  closeModal,
  strTitle,
  strDescription,
  defaultValue,
  OnConfirm,
}: {
  closeModal?: () => void;
  strTitle?:string|undefined;
  strDescription?:string[]|undefined;
  defaultValue?:string|undefined;
  OnConfirm: (text:string) => void;
}) {
  const [text, setText] = useState<string>(defaultValue??"");
  return (
    <ConfirmModal
      strTitle={strTitle?localizationManager.getString(strTitle as localizeStrEnum):"TEXT INPUT"}
      strDescription={<div style={{whiteSpace:"pre-wrap"}}>
        {
          strDescription?.map((str)=>{
            return (
              <div>{localizationManager.getString(str as localizeStrEnum)}</div>
            )
          })
        }
      </div>}
      onCancel={closeModal}
      onOK={() => {
        if (text.length === 0) {
          return;
        }
        OnConfirm(text);
        closeModal?.();
      }}
    >
      <TextField
        value={text}
        rangeMin = {0}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </ConfirmModal>
  );
}