import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import HersherImg from "../../assets/img/hersher.png";
import AboutImg from "../../assets/img/about_us_en.png";
import AboutImgAr from "../../assets/img/about-us-ar.png";
import MagnifierImg from "../../assets/img/maginfier.svg";
import "react-international-phone/style.css";

import { useAuth } from "hooks";
import { AddToWish } from "shared";
import { NovelCard } from "components/NovelCard";
import { Element } from "react-scroll";
import { Outlet, useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { Loader } from "components/Loader";
import { FaSpinner } from "react-icons/fa";

export const Home = () => {
  //states & vars
  const currentLang = i18next.language;
  const { t } = useTranslation();
  const { bearerToken , setLoginShow } = useAuth();
  // const { setGeneral } = useGeneral();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [slider, setSlider] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [aboutUs, setAboutUs] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    subject: "",
    message: "",
  });
  const [formDataErrors, setFormDataErros] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    subject: false,
    message: false,
  });

  //functions fetch
  const handleWishClick = (id) => {
    if(!bearerToken)
    {
      alert(t('You must be logged in'));
      setLoginShow(true);
      return
    }
    const status = AddToWish(bearerToken, id);
    return status;
  };

  const handleFormSubmit = () => {
    setIsSending(true);
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.subject ||
      !formData.subject ||
      !formData.subject
    ) {
      if (!formData.first_name) {
        setFormDataErros((prev) => ({ ...prev, first_name: true }));
      }
      if (!formData.last_name) {
        setFormDataErros((prev) => ({ ...prev, last_name: true }));
      }
      if (!formData.phone_number) {
        setFormDataErros((prev) => ({ ...prev, phone_number: true }));
      }
      if (!formData.subject) {
        setFormDataErros((prev) => ({ ...prev, subject: true }));
      }
      if (!formData.message) {
        setFormDataErros((prev) => ({ ...prev, message: true }));
      }
      setIsSending(false);
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/contact-us`;
    const headers = {
      "Content-type": "application/json",
    };
    const body = {
      name: formData.first_name + " " + formData.last_name,
      phone_number: formData.phone_number,
      subject: formData.subject,
      message: formData.message,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          setFormData({
            ...formData,
            first_name: "",
            last_name: "",
            phone_number: "",
            subject: "",
            message: "",
          });
          alert(t("You message was sent successfully"));
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
        setIsSending(false);
      })
      .catch((error) => {
        console.error(error);
      });
    // setIsSending(false);
  };

  const fetchContent = useCallback(() => {
    const headers = {
      lang: currentLang,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };
    const options = {
      headers: headers,
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/home-page`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setSlider(data.data.sliders);
          setCategories(data.data.categories);
          setFeaturedNovels(data.data.featured_novels);
          // setGeneral(data.data.general);
          setAboutUs(data.data.general.about_us);
        }
      });
  }, [currentLang, bearerToken]);

  //Effects
  useEffect(() => {
    setIsLoading(true);
    fetchContent();
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false when the operation is completed
    }, 2000);
  }, [fetchContent, setIsLoading]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="home">
          <Outlet/>
          <Element name="home-section">
            <section className="slider" dir="">
              <Swiper
                key={currentLang}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ type: "bullets", clickable: true }}
                className="main-slider"
                loop
                autoplay
                speed={500}
                effect="slide"
              >
                {slider.map((slide, key) => (
                  <SwiperSlide className="slide" key={key}>
                    <div className="overlay"></div>
                    <img
                      src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${slide.image}`}
                      className="slide-image"
                      alt=""
                    />
                    <div className="slide-content">
                      <div className="left">
                        <h1 className="title">{slide.title}</h1>
                        <p className="description">{slide.description}</p>
                        <a
                          href={slide.action}
                          className="action-btn"
                          target="__blank"
                        >
                          {t("Explore Now")}
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          </Element>
          <div className="hersher-bar">
            <img src={HersherImg} alt="HER SHER" />
          </div>
          <Element name="categories-section">
            <section className="categories">
              <div className="heading">
                <h1>{t('categories')}</h1>
              </div>

              <Swiper
                loop
                key={currentLang}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={3}
                draggable
                centerInsufficientSlides
                spaceBetween={0}
                autoplay
                speed={500}
                effect="slide"
                navigation
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                }}
                className="categories-slider"
              >
                {categories.map((slide, key) => (
                  <SwiperSlide key={key} className="slide">
                    <a href={`/category/${slide.id}`}>
                      <div className="card">
                        <div className="card__image">
                          <img
                            src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${slide.image}`}
                            alt={slide.title}
                          />
                          <div className="card__title">
                            <h3>{slide.title}</h3>
                          </div>
                        </div>
                        <div className="card__description">
                          <p>{slide.description}</p>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          </Element>

          <Element name="about-section">
            <section className="about-us">
              <div className={`about-image ${i18next.language === "ar" ? 'ar' : ''}`}>
                {i18next.language === "ar" ? (
                  <img src={AboutImgAr} alt={t("about us")} />
                ) : (
                  <img src={AboutImg} alt={t("about us")} />
                )}
              </div>
              <div className={`about-description ${i18next.language === 'ar' ? 'ar' : ''}`}>
                <p>{aboutUs}</p>
              </div>
              {/* <div className="magnifier">
          </div> */}
              <img
                className="magnifier"
                src={MagnifierImg}
                alt={t("about us")}
              />
            </section>
          </Element>

          <Element name="most-wanted-section">
            <section className={`most-wanted ${currentLang === 'ar' ? 'ar' : ''}`}>
              <div className="heading">
                <h1>
                  {t('most wanted')}
                </h1>
              </div>

              <div className="novels-container">
                {featuredNovels.map((card, key) => (
                  <NovelCard
                    card={card}
                    handleWishClick={() => {
                      handleWishClick(card.id);
                    }}
                    key={key}
                    onClick={() => {
                      navigate(`/novel/${card.id}`);
                    }}
                  />
                ))}
              </div>
            </section>
          </Element>

          <Element name="contact-section">
            <section className="contact-us">
              <div className="heading">
                <h1>{t("talk to us")}</h1>
              </div>
              <div className="form-container" style={currentLang === 'ar' ? { direction: 'rtl' } : {}}>
                <div className="form-input">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => {
                      setFormData({ ...formData, first_name: e.target.value });
                      setFormDataErros({
                        ...formDataErrors,
                        first_name: false,
                      });
                    }}
                    className={formDataErrors.first_name ? "error" : ""}
                    placeholder={t("FIRST NAME")}
                  />
                  {formDataErrors.first_name && (
                    <p className="error-message">
                      {t("please fill up this field")}
                    </p>
                  )}
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => {
                      setFormData({ ...formData, last_name: e.target.value });
                      setFormDataErros({ ...formDataErrors, last_name: false });
                    }}
                    className={formDataErrors.last_name ? "error" : ""}
                    placeholder={t("LAST NAME")}
                  />
                  {formDataErrors.last_name && (
                    <p className="error-message">
                      {t("please fill up this field")}
                    </p>
                  )}
                </div>
                <div className="form-input">
                  <PhoneInput
                    value={formData.phone_number}
                    onChange={(e) => {
                      setFormData({ ...formData, phone_number: e });
                      setFormDataErros({
                        ...formDataErrors,
                        phone_number: false,
                      });
                    }}
                    className={formDataErrors.phone_number ? "error" : ""}
                    placeholder={t("PHONE NUMBER")}
                    defaultCountry={"sa"}
                  />
                  {formDataErrors.phone_number && (
                    <p className="error-message">
                      {t("please fill up this field")}
                    </p>
                  )}
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      setFormDataErros({ ...formDataErrors, subject: false });
                    }}
                    className={formDataErrors.subject ? "error" : ""}
                    placeholder={t("SUBJECT")}
                  />
                  {formDataErrors.subject && (
                    <p className="error-message">
                      {t("please fill up this field")}
                    </p>
                  )}
                </div>
                <div className="form-input">
                  <textarea
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      setFormDataErros({ ...formDataErrors, message: false });
                    }}
                    className={formDataErrors.message ? "error" : ""}
                    placeholder={t("TYPE YOUR MESSAGE HERE")}
                  ></textarea>
                  {formDataErrors.message && (
                    <p className="error-message">
                      {t("please fill up this field")}
                    </p>
                  )}
                </div>
                <button onClick={handleFormSubmit} className="submit">
                  {isSending ? <FaSpinner className="spinner" /> : t("Send")}
                </button>
              </div>
            </section>
          </Element>
        </div>
      )}
    </>
  );
};
