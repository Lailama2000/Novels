import { useAuth } from "hooks";
import i18next, { t } from "i18next";
import React, { useState } from "react";
import { ReactComponent as EyeIcon } from "../../assets/img/show.svg";
import { Loader } from "components/Loader";

export const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const { bearerToken } = useAuth();
  const [name, setName] = useState(userData.name || "");
  const [nameError, setNameError] = useState(false);
  const [birth, setBirth] = useState(userData.birthday || "");
  const [birthError, setBirthError] = useState(false);
  const [phone, setPhone] = useState(userData.phone_number || "");
  const [phoneError, setPhoneError] = useState(false);
  const [email, setEmail] = useState(userData.email || "");
  const [emailError, setEmailError] = useState(false);
  const [gender, setGender] = useState(userData.gender || "male");
  const [genderError, setGenderError] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitClick = () => {
    if (!name || !birth || !phone || !email || !gender) {
      if (!name) {
        setNameError(true);
      }
      if (!birth) {
        setBirthError(true);
      }
      if (!phone) {
        setPhoneError(true);
      }
      if (!email) {
        setEmailError(true);
      }
      if (!gender) {
        setGenderError(true);
      }
      return;
    }
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/update-profile`;
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${bearerToken}`,
    };
    const body = {
      name: name,
      birthday: birth,
      phone_number: phone,
      gender: gender,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const updatedUserData = {
          name: name,
          birthday: birth,
          phone_number: phone,
          gender: gender,
          email: data.data.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        alert(t('Profile was edited successfully'))
        setIsLoading(false);
        if(!data.status){
          throw data.message;
        }
      })
      .catch((error)=>{
        alert(error);
        setIsLoading(false);
      });
  };

  const handleSubmitNewPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      if (!currentPassword) {
        setCurrentPasswordError(true);
      }
      if (!newPassword) {
        setNewPasswordError(true);
      }
      if (!confirmPassword) {
        setConfirmPasswordError(true);
      }
      return;
    }
    if (newPassword !== confirmPassword) {
      setNewPasswordError(true);
      setConfirmPasswordError(true);
      setErrorMessage(t("Passwords do not mutch"));
      return;
    }
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/change-password`;
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${bearerToken}`,
    };
    const body = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((respons) => respons.json())
      .then((data) => {
        if (data.status) {
          alert(t('Password updated successfully'));
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setIsLoading(false);
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
        setIsLoading(false);
      });
  };

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
  };

  // const formatDate = (dateString) => {
  //   const [year, month, day] = dateString.split("-");
  //   const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
  //     2,
  //     "0"
  //   )}`;
  //   return formattedDate;
  // };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`profile ${i18next.language === 'ar' ? 'ar' : ''}`}>
          <div className="form-container">
            <h2>{t("Profile")}</h2>
            <div
              className={`profile-informations ${
                showChangePassword ? "hide" : "show"
              }`}
            >
              <div className="line">
                <div className={`input-wrapper ${nameError ? "error" : ""}`}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder={t("Name")}
                  />
                </div>
                <div className={`input-wrapper ${birthError ? "error" : ""}`}>
                  <input
                    type="text"
                    value={birth}
                    onChange={(e) => {
                      setBirth(e.target.value);
                    }}
                    placeholder={t('Birthdate')}
                    onFocus={(e) => {
                      e.target.type = "date";
                    }}
                  />
                </div>
              </div>
              <div className="line">
                <div
                  className={`input-wrapper phone ${phoneError ? "error" : ""}`}
                >
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    placeholder={t("Phone Number")}
                  />
                </div>
                <div className={`input-wrapper ${emailError ? "error" : ""}`}>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder={t("Email")}
                  />
                </div>
              </div>
              <div className={`radio-gender ${genderError ? "error" : ""}`}>
                <button
                  onClick={() => {
                    setGender("male");
                  }}
                  className={gender === "male" ? "active" : ""}
                >
                  {t("Male")}
                </button>
                <button
                  onClick={() => {
                    setGender("female");
                  }}
                  className={gender === "female" ? "active" : ""}
                >
                  {t("Female")}
                </button>
              </div>
              <br />
              <button
                onClick={() => {
                  handleSubmitClick();
                }}
              >
                {t("Submit")}
              </button>
              <button
                className="change-password-button"
                onClick={() => {
                  handleChangePasswordClick();
                }}
              >
                {t("Change Password")}
              </button>
            </div>
            <div
              className={`change-password ${
                showChangePassword ? "show" : "hide"
              }`}
            >
              <div className="line">
                <div
                  className={`input-wrapper ${
                    currentPasswordError ? "error" : ""
                  }`}
                >
                  <input
                    type={showOldPass ? "text" : "password"}
                    placeholder={t("Current Password")}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setCurrentPasswordError(false);
                    }}
                  />
                  <EyeIcon
                    className="eye-icon"
                    onClick={() => {
                      setShowOldPass(!showOldPass);
                    }}
                  />
                </div>
              </div>
              <div className="line">
                <div
                  className={`input-wrapper ${newPasswordError ? "error" : ""}`}
                >
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={t("New Password")}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPasswordError(false);
                      setErrorMessage(false);
                    }}
                  />
                  <EyeIcon
                    className="eye-icon"
                    onClick={() => {
                      setShowPass(!showPass);
                    }}
                  />
                </div>
              </div>
              <div className="line">
                <div
                  className={`input-wrapper ${
                    confirmPasswordError ? "error" : ""
                  }`}
                >
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder={t("Confirm New Password")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError(false);
                      setErrorMessage(false);
                    }}
                  />
                  <EyeIcon
                    className="eye-icon"
                    onClick={() => {
                      setShowConfirmPass(!showConfirmPass);
                    }}
                  />
                </div>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <button
                className="submit-password"
                onClick={handleSubmitNewPassword}
              >
                {t("Submit")}
              </button>
              <button
                className="back-button"
                onClick={() => {
                  setShowChangePassword(false);
                }}
              >
                {t("Profile Informations")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
