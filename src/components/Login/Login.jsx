// import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";
import { ReactComponent as ShowIcon } from "../../assets/img/show.svg";
import { useAuth } from "hooks";    
import { useState } from "react";
import i18next from "i18next";

export const Login = () => {

//   const currentLang = i18next.language;
  const { t } = useTranslation();
  const {setUser,setLoginShow,setRegisterShow , setForgotShow} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassord = () => {
    setShowPassword(!showPassword);
  };

  const handleClickRegister = (e)=>{
    e.preventDefault();
    setRegisterShow();
    setLoginShow(false);
  }

  const handleForgotClick = (e)=>{
    e.preventDefault();
    setForgotShow();
    setLoginShow(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === '')
    {
        setEmailError(t('Email is required'));
    }
    else if(!emailPattern.test(email))
    {
        setEmailError(t('Invalid email format'));
    }
    else
    {
        setEmailError('');
    }

    if(password===''){
        setPasswordError(t('Password is required'));
    }
    else if(password.length < 6){
        setPasswordError(t('Password must be at least 6 characters'));
    }
    else{
        setPasswordError('');
    }

    try{
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email':email,
                'password':password,
            })
          };
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`,options);
        const data = await response.json();
        if(response.ok){
            if(data.status)
            {
                setUser(data.data.user,data.data.token);
                setEmail('');
                setPassword('');
                setLoginShow(false);
            }
        }
        else{
          throw data.message;
        }

    } catch(error){
        console.log(error);
        alert(error);
    }

    
  };

  return (
    <div className={`login ${i18next.language === 'ar' ? 'ar' : ''}`}>
      <div className="popup">
        <DismissIcon onClick={()=>{setLoginShow(false)}} className="popup__dismiss" />
        <div className="popup__heading">
          <h2>{t("Login to your account")}</h2>
        </div>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <div className="popup__body">
            <div className="email">
              <input
                type="text"
                placeholder={t("Email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
            {emailError && <p className="error">{emailError}</p>}
            <div className="password">
              <input
                type={`${showPassword === true ? "text" : "password"}`}
                placeholder={t("Password")}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
              <ShowIcon
                className="icon"
                onClick={() => {
                  handleShowPassord();
                }}
              />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}
            <div className="forgot-password">
              <a onClick={(e)=>{handleForgotClick(e)}} href="/">{t("Forgot Password")}</a>
            </div>
            <button className="submit" type="submit">
              {t("Login")}
            </button>
            <div className="register-link">
              <p>
                {t("Don't have an account?")} <a href="/register" onClick={(e)=>{handleClickRegister(e)}}>{t("Create One")}</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
