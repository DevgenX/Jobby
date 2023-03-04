import { Navigate } from "react-router-dom";
import { useAppContext } from "../components/context/appContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return children;
};
export default ProtectedRoute;
