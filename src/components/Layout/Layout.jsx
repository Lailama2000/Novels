import { Footer, Forgot, Header, Loader, Register } from "components";
import { useAuth, useGeneral } from "hooks";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const { registerShow, setRegisterShow , forgotShow} = useAuth();
  const location = useLocation();
  const { isLoading } = useGeneral();
  useEffect(() => {
    if (location.pathname === "/register") {
      setRegisterShow();
    }
  }, [location, setRegisterShow]);
  return (
    <>
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
          <Outlet />
      )}
      {registerShow && <Register />}
      {forgotShow && <Forgot />}
      <Footer />
    </>
  );
};
