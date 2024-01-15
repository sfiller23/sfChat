import { RiImageAddFill } from "react-icons/ri";
import "./_img-preview-button.scss";
import { useHandleImgPick } from "../../../utils/Hooks";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { uploadAvatar } from "../../../api/firebase/api";
import { BaseSyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { AppContext } from "../../../context/appContext/AppContext";
import { AppStateActions, PreviewState } from "../../../constants/enums";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";

interface imgPreviewButtonProps {
  action?: PreviewState;
  inForm?: boolean;
}

const ImgPreviewButton = (props: imgPreviewButtonProps) => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const user = useAppSelector((state) => state.chatReducer.user);

  const { action = PreviewState.ADD, inForm = true } = props;
  const { picture, setPicture, imgData, handleImgPreview } = useHandleImgPick();
  const [isPreview, setIsPreview] = useState(false);

  const handleAvatarUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
      appContext?.setLoadingState(true);
      if (picture && (authContext?.state.user?.userId || user?.userId)) {
        await uploadAvatar(
          e as Event,
          picture,
          authContext?.state.user?.userId
            ? authContext?.state.user?.userId
            : (user?.userId as string)
        );
      }

      setPicture(null);
      setIsPreview(false);
      appContext?.setImageProfileChange();
    } catch (error) {
      alert(error);
    } finally {
      appContext?.setLoadingState(false);
    }
  };

  return (
    <>
      <input
        type="file"
        name="avatar"
        id="avatar"
        style={{ display: `${!picture ? "none" : "block"}` }}
        onChange={(e) => {
          e.preventDefault();
          handleImgPreview(e);
          setIsPreview(true);
        }}
      />

      {!inForm && imgData && isPreview && (
        <button onClick={handleAvatarUpload} className="avatar-upload-button">
          <HiOutlineCloudUpload className="upload-avatar-icon" size={20} />
          <label className="upload-avatar-label">Upload</label>
        </button>
      )}
      <>
        {!picture && (
          <label className="avatar-label" htmlFor="avatar">
            <RiImageAddFill size={20} />
            <span>{`${action} ${
              action === PreviewState.ADD ? "an" : "the"
            } Avatar`}</span>
          </label>
        )}
        {imgData && isPreview && (
          <img
            className="img-preview"
            src={imgData as string}
            alt="Image Preview"
          />
        )}
      </>
    </>
  );
};

export default ImgPreviewButton;
