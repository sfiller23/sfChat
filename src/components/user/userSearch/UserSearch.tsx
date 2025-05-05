import { BaseSyntheticEvent } from "react";
import { getUsers } from "../../../redux/chat/chatAPI";
import { searchUser } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import "./_user-search.scss";

/**
 * UserSearch Component
 *
 * This component provides a search bar for filtering users in the user list.
 * It allows the user to search for specific users by their display name.
 */
const UserSearch = () => {
  const dispatch = useAppDispatch();

  /**
   * Handles the search input change event.
   * - If the input is empty, fetches the full list of users.
   * - Otherwise, dispatches an action to filter users based on the search query.
   *
   * @param e - The event triggered by the input change.
   */
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
