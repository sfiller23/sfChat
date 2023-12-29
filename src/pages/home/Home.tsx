import Card from "../../UI/card/Card";
import "./home.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { AppContext } from "../../context/appContext/AppContext";
import Loader from "../../UI/loader/Loader";
import ImgPreviewButton, {
  PreviewState,
} from "../../components/imgPreviewButton/ImgPreviewButton";
import UserList from "../../components/userList/UserList";
import UserSearch from "../../components/userSearch/UserSearch";
import Chat from "../../components/chat/Chat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../App";
import { getChats, getUserByUid, getUsers } from "../../redux/chat/chatAPI";
import { AuthStateActions } from "../../interfaces/auth";

const Home = () => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.chatReducer.user);

  const userId = JSON.parse(localStorage.getItem("uid") as string);

  useEffect(() => {
    const updateChatIds = () => {
      const unSub2 = onSnapshot(collection(db, "chatIds"), (doc) => {
        doc.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              dispatch(getChats());
              dispatch(getUsers());
              console.log(userId);
              if (userId) {
                dispatch(getUserByUid(userId));
              }

              break;
            case "modified":
              break;
            default:
              return;
          }
        });
      });

      return () => {
        unSub2();
      };
    };
    updateChatIds();
  }, []);

  const logOutHandler = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          loggedIn: false,
        });
        authContext?.dispatch({ type: AuthStateActions.LOGOUT });
      }
    } catch (error) {
      alert(`${error} in logOutHandler`);
    }
  };

  return (
    <Card classNames={["chat-card"]}>
      <span className="users-container">
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

          <span className="logout-button-container">
            <button
              type="button"
              onClick={logOutHandler}
              className="logout-button"
            >
              Logout
            </button>
          </span>
          <div className="display-name-container">
            <h3>{user?.displayName}</h3>
          </div>
        </div>
        <UserSearch />
        <UserList />
      </span>
      <span className="seperator"></span>
      <Chat />
    </Card>
  );
};

export default Home;
