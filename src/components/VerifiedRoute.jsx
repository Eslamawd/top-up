import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifiedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-muted-foreground">Checking verification...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.verified) {
    return <Navigate to="/send-verified" replace />;
  }

  return <Outlet />;
};

export default VerifiedRoute;
