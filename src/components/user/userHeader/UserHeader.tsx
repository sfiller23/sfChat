import { useContext } from "react";
import Loader from "../../../UI/loader/Loader";
import { setLoggedInState } from "../../../api/firebase/api";
import { ImagePreviewState } from "../../../constants/enums";
import { AppContext } from "../../../context/appContext/AppContext";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { ChatState, clearChat } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import ImgPreviewButton from "../../common/imgPreviewButton/ImgPreviewButton";
import "./_user-header.scss";

/**
 * UserHeader Component
 *
 * This component displays the user's profile information, including their display name
 * and profile image. It also provides functionality for logging out and managing the
 * profile image (add/edit).
 *
 * Props:
 * - `user`: Partial<ChatState> - Contains user-related information such as display name and user ID.
 */

const UserHeader = (props: Partial<ChatState>) => {
  const { user } = props;

  const dispatch = useAppDispatch();

  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  /**
   * Handles the logout process.
   * - Updates the user's logged-in state in Firebase.
   * - Clears authentication and application state.
   * - Dispatches an action to clear the chat state.
   */
  const logOutHandler = async () => {
    try {
      if (user) {
        await setLoggedInState(false, user.userId); // Update logged-in state in Firebase
        authContext?.logOut();
        appContext?.clearAppState();
        dispatch(clearChat());
      }
    } catch (error) {
      alert(`${error} in logOutHandler`);
    }
  };

  return (
    <div
      className={`user-header ${
        !!appContext?.state.imgProfileUrl ? "no-image" : ""
      }`}
    >
      {appContext?.state.isLoading ? (
        <Loader className="profile-image-loader" />
      ) : (
        <>
          <div className="display-name-container">
            <h3>{user?.displayName}</h3>
          </div>
          <span className="user-img-container">
            {!!appContext?.state.imgProfileUrl && (
              <img
                className="user-img"
                src={appContext?.state.imgProfileUrl}
                alt="Profile Image"
              />
            )}
            <ImgPreviewButton
              action={
                !!appContext?.state.imgProfileUrl
                  ? ImagePreviewState.EDIT
                  : ImagePreviewState.ADD
              }
              inForm={false}
            />
          </span>
        </>
      )}

      <span>
        <button type="button" onClick={logOutHandler} className="logout-button">
          Logout
        </button>
      </span>
    </div>
  );
};

export default UserHeader;
