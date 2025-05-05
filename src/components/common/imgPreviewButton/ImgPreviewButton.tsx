import { BaseSyntheticEvent, useContext, useState } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { RiImageAddFill } from "react-icons/ri";
import { uploadAvatar } from "../../../api/firebase/api";
import { ImagePreviewState } from "../../../constants/enums";
import { AppContext } from "../../../context/appContext/AppContext";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";
import { useHandleImgPick } from "../../../utils/Hooks";
import "./_img-preview-button.scss";

/**
 * ImgPreviewButton Component
 *
 * This component provides functionality for selecting, previewing, and uploading a profile image.
 * It supports two actions: adding a new avatar or editing an existing one.
 *
 * Props:
 * - `action`: Specifies whether the button is for adding or editing an avatar (default is `ADD`).
 * - `inForm`: Determines if the button is used within a form (default is `true`).
 */
interface imgPreviewButtonProps {
  action?: ImagePreviewState;
  inForm?: boolean;
}

const ImgPreviewButton = (props: imgPreviewButtonProps) => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const user = useAppSelector((state) => state.chatReducer.user);

  const { action = ImagePreviewState.ADD, inForm = true } = props;
  const { picture, setPicture, imgData, handleImgPreview } = useHandleImgPick(); // Custom hook for handling image selection
  const [isPreview, setIsPreview] = useState(false); // on image selection there is a preview before the user decide to upload

  /**
   * Handles the avatar upload process.
   * - Uploads the selected image to Firebase Storage.
   * - Updates the application state to reflect the new profile image.
   *
   * @param e - The event triggered by the upload action.
   */
  const handleAvatarUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
      appContext?.setLoadingState(true);
      if (picture && (authContext?.state.user?.userId || user?.userId)) {
        await uploadAvatar(
          e as Event,
          picture,
          authContext?.state.user?.userId
            ? authContext?.state.user?.userId
            : (user?.userId as string) // Use the user ID from context or Redux
        );
      }

      setPicture(null); // Clear the selected picture
      setIsPreview(false); // Disable the preview
      appContext?.setImageProfileChange(); // Notify the app of the profile image change
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
      {/* Upload button displayed when an image is selected and not in a form - if its in the register form the image loads on submit. no need for an upload button */}
      {!inForm && imgData && isPreview && (
        <button onClick={handleAvatarUpload} className="avatar-upload-button">
          <HiOutlineCloudUpload className="upload-avatar-icon" size={20} />
          <label className="upload-avatar-label">Upload</label>
        </button>
      )}
      <>
        {/* Label for selecting an image when no image is selected */}
        {!picture && (
          <label className="avatar-label" htmlFor="avatar">
            <RiImageAddFill size={20} />
            <span>{`${action} ${
              action === ImagePreviewState.ADD ? "an" : "the"
            } Avatar`}</span>
          </label>
        )}
        {/* Image preview displayed when an image is selected */}
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
