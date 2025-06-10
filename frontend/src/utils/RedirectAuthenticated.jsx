import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";

function RedirectAuthenticated({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    <Navigate to={``} />;
  }
  return children;
}

export default RedirectAuthenticated;
