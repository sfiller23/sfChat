import { useContext } from "react";
import Loader from "../../../UI/loader/Loader";
import { AuthStateActions, PreviewState } from "../../../constants/enums";
import ImgPreviewButton from "../../common/imgPreviewButton/ImgPreviewButton";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { AppContext } from "../../../context/appContext/AppContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../App";
import { ChatState, clearChat } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import "./_user-header.scss";

const UserHeader = (props: Partial<ChatState>) => {
  const { user } = props;

  const dispatch = useAppDispatch();

  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const logOutHandler = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, "users", user.userId), {
          loggedIn: false,
        });
        authContext?.dispatch({ type: AuthStateActions.LOGOUT });
        dispatch(clearChat());
      }
    } catch (error) {
      alert(`${error} in logOutHandler`);
    }
  };

  return (
    <div
      className={`user-header ${
        !!appContext?.state.imgProfileUrl && "no-image"
      }`}
    >
      {appContext?.state.isLoading ? (
        <Loader className="profile-image-loader" />
      ) : (
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
                ? PreviewState.EDIT
                : PreviewState.ADD
            }
            inForm={false}
          />
        </span>
      )}

      <span>
        <button type="button" onClick={logOutHandler} className="logout-button">
          Logout
        </button>
      </span>
      <div className="display-name-container">
        <h3>{user?.displayName}</h3>
      </div>
    </div>
  );
};

export default UserHeader;
