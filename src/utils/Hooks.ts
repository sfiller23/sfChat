import { BaseSyntheticEvent, useState } from "react";

export const useHandleImgPick = () => {
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);

  const handleImgPreview = (e: BaseSyntheticEvent | Event) => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return { picture, setPicture, imgData, handleImgPreview };
};
