import i18next, { t } from "i18next";
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";
import { ReactComponent as EyeIcon } from "../../assets/img/show.svg";
import { ReactComponent as EyeIconHide } from "../../assets/img/hide-password.svg";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "hooks";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { bearerToken } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");


  const handleDissmissClick = ()=>{
    window.location.href = '/';
  }
  const handleFormSubmit = () => {
    const errors = {};

    if (!password) {
      errors.password = t("Password is required");
    } else if (password.length < 6) {
      errors.password = t("Password should be at least 6 characters long");
    }

    if (!passwordConfirm) {
      errors.passwordConfirm = t("Password confirmation is required");
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = t("Passwords do not match");
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }


    const url = `${process.env.REACT_APP_BASE_URL}/reset-password`;
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      token: token,
      new_password: password,
      confirm_password: passwordConfirm,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("Password was changed successfully");
          console.log(data);
          window.location.href = '/';
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };

  useEffect(()=>{
    if(bearerToken)
    {
        alert(t('You are logged in'));
        window.location.href = '/';
    }
  },[bearerToken])
  return (
    <div className={`reset-password ${i18next.language === 'ar' ? 'ar' : ''}`}>
      <div className="popup">
        <DismissIcon className="dismiss" onClick={handleDissmissClick} />

        <div className="heading">
          <h2>{t("Reset Password")}</h2>
        </div>

        <div className="form-container">
          <div className="form-input">
            <input
              type={`${showPassword === true ? "text" : "password"}`}
              placeholder={t("Password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  password: "",
                }));
              }}
            />
            {showPassword ? (
              <EyeIcon
                className="eye-icon"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <EyeIconHide
                className="eye-icon"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
            {formErrors.password && (
              <p className="error">{formErrors.password}</p>
            )}
          </div>

          <div className="form-input">
            <input
              type={`${showPasswordConfirm === true ? "text" : "password"}`}
              placeholder={t("Password Confirm")}
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  passwordConfirm: "",
                }));
              }}
            />
            {showPasswordConfirm ? (
              <EyeIcon
                className="eye-icon"
                onClick={() => {
                  setShowPasswordConfirm(!showPasswordConfirm);
                }}
              />
            ) : (
              <EyeIconHide
                className="eye-icon"
                onClick={() => {
                  setShowPasswordConfirm(!showPasswordConfirm);
                }}
              />
            )}
            {formErrors.passwordConfirm && (
              <p className="error">{formErrors.passwordConfirm}</p>
            )}
          </div>

          <button className="submit" onClick={handleFormSubmit}>
            {t("Reset Password")}
          </button>
        </div>
      </div>
    </div>
  );
};
