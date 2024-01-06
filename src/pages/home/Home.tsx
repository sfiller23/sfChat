import Card from "../../UI/card/Card";
import "./home.css";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { AppContext } from "../../context/appContext/AppContext";
import Loader from "../../UI/loader/Loader";
import ImgPreviewButton from "../../components/imgPreviewButton/ImgPreviewButton";
import UserList from "../../components/userList/UserList";
import UserSearch from "../../components/userSearch/UserSearch";
import Chat from "../../components/chat/Chat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../App";
import { getChats, getUserByUid, getUsers } from "../../redux/chat/chatAPI";
import { AuthStateActions, PreviewState } from "../../constants/enums";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { addChatId, clearChat } from "../../redux/chat/chatSlice";
import { ChatObj } from "../../interfaces/chat";

const Home = () => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const user = useAppSelector((state) => state.chatReducer.user);

  const [chat, setChat] = useState<ChatObj>();

  //const activeUid = localStorage.getItem("activeUid");

  //const { userId } = useParams();

  // useEffect(() => {
  //   if (activeUid) {
  //     navigate(activeUid);
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    dispatch(getChats());
  }, []);

  // useEffect(() => {
  //   const updateChatIds = () => {
  //     const unSub = onSnapshot(collection(db, "chatIds"), (doc) => {
  //       doc.docChanges().forEach((change) => {
  //         switch (change.type) {
  //           case "added":
  //             dispatch(getChats());
  //             dispatch(getUsers());
  //             console.log({ ...change.doc.data() }, "user list hook");
  //             //localStorage.setItem("chatId", change.doc.data().chatId);
  //             //dispatch(addChatId(change.doc.data().chatId));

  //             break;
  //           case "modified":
  //             break;
  //           default:
  //             return;
  //         }
  //       });
  //     });

  //     return () => {
  //       unSub();
  //     };
  //   };
  //   updateChatIds();
  // }, []);

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
      <Chat user={user} />
    </Card>
  );
};

export default Home;
