import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../api/Authorization.tsx";
import { useState, useEffect } from "react";

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const auth = await isLoggedIn();

      setIsAuth(auth);
    };

    check();
  }, [location.pathname]);

  if (isAuth == null) return null;
  else return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
