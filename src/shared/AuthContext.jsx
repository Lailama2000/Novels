import { t } from "i18next";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  //context
  const [loginShow, setLoginShow] = useState(false);
  const [registerShow , _setRegisterShow] = useState(false);
  const [forgotShow , _setForgotShow] = useState(false);
  const [user, _setUser] = useState(
    JSON.parse(localStorage.getItem("user") || null)
  );
  const [bearerToken, setBearerToken] = useState(
    localStorage.getItem("bearer_token") || null
  );

  const setUser = (user = null, bearer_token = "") => {
    if (user && bearer_token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("bearer_token", bearer_token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("bearer_token");
    }
    _setUser(user);
    setBearerToken(bearer_token);
  };
  const setRegisterShow = (show = true)=>{
    if(bearerToken)
    {
      alert(t('You Are Logged In'))
      return;
    }
    _setRegisterShow(show);
  }

  const setForgotShow = (show = true)=>{
    if(bearerToken)
    {
      alert(t('You Are Logged In'))
      return;
    }
    _setForgotShow(show);
  }

  const logout = () => {
    const url = `${process.env.REACT_APP_BASE_URL}/logout`;
    const headers = {
      authorization: `Bearer ${bearerToken}`,
    };
    const options = {
      method: "POST",
      headers: headers,
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (!data.status) {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setUser();
  };

  const contextValue = {
    loginShow,
    setLoginShow,
    registerShow,
    setRegisterShow,
    forgotShow,
    setForgotShow,
    user,
    setUser,
    bearerToken,
    logout,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
