import { ConfirmModal, TextField } from "decky-frontend-lib";
import { useState } from "react";
import { LocalizationManager, localizeStrEnum } from "../i18n";

interface TextInputModalProps {
  closeModal?: () => void;
  strTitle?: string;
  strDescription?: string[];
  defaultValue?: string;
  OnConfirm: (text: string) => void;
}

export function TextInputModal({
  closeModal,
  strTitle = "TEXT INPUT",
  strDescription = [],
  defaultValue = "",
  OnConfirm,
}: TextInputModalProps) {
  const [text, setText] = useState<string>(defaultValue);

  const handleConfirm = () => {
    if (text.length === 0) {
      return;
    }
    OnConfirm(text);
    closeModal?.();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <ConfirmModal
      strTitle={LocalizationManager.getString(strTitle as localizeStrEnum)}
      strDescription={
        <div style={{ whiteSpace: "pre-wrap" }}>
          {strDescription.map((str) => (
            <div key={str}>{LocalizationManager.getString(str as localizeStrEnum)}</div>
          ))}
        </div>
      }
      onCancel={closeModal}
      onOK={handleConfirm}
    >
      <TextField value={text} onChange={handleTextChange} />
    </ConfirmModal>
  );
}