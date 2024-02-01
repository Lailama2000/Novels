import { useAuth } from 'hooks';
import i18next, { t } from 'i18next';
import { useState } from 'react'
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";

export const Forgot = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const {setForgotShow} = useAuth();

  const handleEmailSubmit = () => {
    if (!email) {
      setEmailError(t("please fill up this field"));
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError(t("Email is not valid"));
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/forgot-password`;
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      email: email,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if(data.status)
        {
          alert(t("We have sent you an email containing the password reset link, Please check your email"));
          setForgotShow(false);
        }
        else
        {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (
    <div className={`forgot ${i18next.language === 'ar' ? 'ar' : ''}`}>
      <div className="email">
          <DismissIcon
            className="dismiss"
            onClick={() => {
              setForgotShow(false);
            }}
          />

          <div className="heading">
            <h2>{t("Reset Password")}</h2>
          </div>

          <div className="email__body">
            <div className="email-input">
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder={t("Email")}
              />
            </div>
            {emailError && <p className="error">{emailError}</p>}
            <button
              onClick={handleEmailSubmit}
              className="submit"
              type="submit"
            >
              {t("Send")}
            </button>
          </div>
        </div>
    </div>
  )
}
