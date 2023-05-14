import { ConfirmModal, TextField } from "decky-frontend-lib";
import { useState } from "react";

export function TextInputModal({
  closeModal,
  OnConfirm,
}: {
  closeModal?: () => void;
  OnConfirm: (text:string) => void;
}) {
  const [text, setText] = useState<string>("");
  return (
    <ConfirmModal
      strTitle="TEXT INPUT"
      onCancel={closeModal}
      onOK={() => {
        if (text.length === 0) {
          return;
        }
        OnConfirm(text);
        closeModal?.();
      }}
    >
      <div/>
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