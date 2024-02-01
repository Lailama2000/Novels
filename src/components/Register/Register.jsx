import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";
import { ReactComponent as EyeIcon } from "../../assets/img/show.svg";
import { ReactComponent as EyeIconHide } from "../../assets/img/hide-password.svg";
import { useAuth } from "hooks";
import i18next, { t } from "i18next";
import prefixOptions from "../../countries.json";

export const Register = () => {
  const { setRegisterShow ,setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [token, setToken] = useState("");
  const [completeProfile, setCompleteProfile] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState("+966");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const dropdownRef = useRef(null);

  const handleEmailSubmit = () => {
    if (!email) {
      setEmailError(t("please fill up this field"));
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError(t("Email is not valid"));
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/send-link-email`;
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
        if (data.status) {
          setToken(data.data.token);
          setCompleteProfile(true);
          console.log(data);
        } else {
          setCompleteProfile(false);
          setToken("");
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };

  const handleFormSubmit = () => {
    const errors = {};
    if (!phone) {
      errors.phone = t("Phone number is required");
    } else if (phone.length < 9 || phone.length > 10) {
      errors.phone = t("Please Enter a valid number");
    }
    if (!name) {
      errors.name = t("Name is required");
    }
    if (!gender) {
      errors.gender = t("Gender is required");
    }
    if (!birthDate) {
      errors.birthDate = t("Birth date is required");
    }

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

    if (!token) {
      alert(t("somthing went wrong pleas try again to send your email"));
      setCompleteProfile(false);
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/register`;
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      token: token,
      name: name,
      password: password,
      birthday: birthDate,
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
        if (data.status) {
          const userData = {
            name: name,
            birthday: birthDate,
            phone_number: phone,
            gender: gender,
            email:email,
          }
          const bearer_token = data.data.token;
          setUser(userData,bearer_token);
          alert(t("Your Account was created successfully"));
          setRegisterShow(false);
          console.log(data);
        } else {
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
  useEffect(() => {
    if (showDropDown && dropdownRef.current && selectedPrefix) {
      const selectedOption = dropdownRef.current.querySelector(".selected");
      selectedOption.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  }, [showDropDown, selectedPrefix]);
  return (
    <div className={`register ${i18next.language === 'ar' ? 'ar' : ''}`}>
      {completeProfile ? (
        <div className="complete">
          <DismissIcon
            className="dismiss"
            onClick={() => {
              setRegisterShow(false);
            }}
          />

          <div className="heading">
            <h2>{t("Create a new Account")}</h2>
          </div>

          <div className="form-container">
            <div className="form-input">
              <div
                className="pref-dropdown"
                onClick={() => {
                  setShowDropDown(!showDropDown);
                }}
              >
                {selectedPrefix}
              </div>
              {showDropDown && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  {prefixOptions.map((option) => (
                    <div
                      className={`dropdown-option ${
                        option.value === selectedPrefix ? "selected" : ""
                      }`}
                      key={option.value}
                      onClick={() => {
                        setSelectedPrefix(option.value);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
              <input
                type="number"
                className="phone-input"
                placeholder={t("Phone Number")}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    phone: "",
                  }));
                }}
              />
              {formErrors.phone && <p className="error">{formErrors.phone}</p>}
            </div>

            <div className="form-input">
              <input
                type="text"
                placeholder={t("Email")}
                value={email && email}
                disabled
              />
            </div>

            <div className="form-input">
              <input
                type="text"
                placeholder={t("Full Name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    name: "",
                  }));
                }}
              />
              {formErrors.name && <p className="error">{formErrors.name}</p>}
            </div>

            <div className="form-input">
              <select
                className="gender-select"
                onChange={(e) => {
                  setGender(e.target.value);
                  setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    gender: "",
                  }));
                }}
              >
                <option selected={gender === ""} value="">
                  {t("Gender")}
                </option>
                <option selected={gender === "male"} value={"male"}>
                  {t("male")}
                </option>
                <option selected={gender === "female"} value={"female"}>
                  {t("female")}
                </option>
              </select>
              {formErrors.gender && (
                <p className="error">{formErrors.gender}</p>
              )}
            </div>

            <div className="form-input">
              <input
                type="date"
                placeholder={t("Birthdate")}
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    birthDate: "",
                  }));
                }}
              />
              {formErrors.birthDate && (
                <p className="error">{formErrors.birthDate}</p>
              )}
            </div>

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
              {t("Sign Up")}
            </button>
          </div>
        </div>
      ) : (
        <div className="email">
          <DismissIcon
            className="dismiss"
            onClick={() => {
              setRegisterShow(false);
            }}
          />

          <div className="heading">
            <h2>{t("Create a new Account")}</h2>
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
      )}
    </div>
  );
};
