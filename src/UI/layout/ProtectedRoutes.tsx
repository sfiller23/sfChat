import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  useEffect(() => {
    context?.state.logedIn === false && navigate("/login");
  }, [context?.state.logedIn]);

  return <></>;
};

export default ProtectedRoutes;
