import { RiImageAddFill } from "react-icons/ri";
import "./imgPreviewButton.css";
import { useHandleImgPick } from "../../utils/Hooks";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { uploadAvatar } from "../../api/firebase/api";
import { BaseSyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { AppContext } from "../../context/appContext/AppContext";
import { AppStateActions, PreviewState } from "../../constants/enums";

interface imgPreviewButtonProps {
  action?: PreviewState;
  inForm?: boolean;
}

const ImgPreviewButton = (props: imgPreviewButtonProps) => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const { action = PreviewState.ADD, inForm = true } = props;
  const { picture, setPicture, imgData, handleImgPreview } = useHandleImgPick();
  const [isPreview, setIsPreview] = useState(false);

  const handleAvatarUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
      appContext?.dispatch({
        type: AppStateActions.SET_LOADING,
        payload: true,
      });
      await uploadAvatar(
        e as Event,
        picture,
        authContext?.state.user?.userId as string
      );
      setPicture(null);
      setIsPreview(false);
      appContext?.dispatch({ type: AppStateActions.SET_IMAGE_PROFILE_CHANGE });
    } catch (error) {
      alert(error);
    } finally {
      appContext?.dispatch({
        type: AppStateActions.SET_LOADING,
        payload: false,
      });
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
        <button
          onClick={handleAvatarUpload}
          className="avatar-upload avatar-upload-button"
        >
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
