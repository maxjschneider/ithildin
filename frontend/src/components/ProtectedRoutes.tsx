import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../api/Authorization.tsx";
import { useState, useEffect } from "react";

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loaded, setIsLoaded] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const auth = await isLoggedIn();

      setIsAuth(auth);
      setIsLoaded(true);
    };

    check();
  }, [location.pathname]);

  if (!loaded) return null;
  else return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
