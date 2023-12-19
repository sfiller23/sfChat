import { BaseSyntheticEvent } from "react";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import { searchUser } from "../../../redux/chat/chatSlice";
import { getUsers } from "../../../redux/chat/chatAPI";
import "./_user-search.scss";

const UserSearch = () => {
  const dispatch = useAppDispatch();

  const search = (e: BaseSyntheticEvent | Event) => {
    if (!e.target.value) {
      dispatch(getUsers());
      return;
    }
    dispatch(searchUser(e.target.value));
  };
  return (
    <div className="search-input-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search Users..."
        onChange={search}
      />
    </div>
  );
};

export default UserSearch;
