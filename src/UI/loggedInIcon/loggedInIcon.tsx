import "./_logged-in-icon.scss";

const LoggedInIcon = (props) => {
  const { loggedIn } = props;
  return (
    <div
      className={`is-loggedin-icon ${loggedIn ? "logged-in" : "logged-out"}`}
    ></div>
  );
};

export default LoggedInIcon;
