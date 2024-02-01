import Logo from "../../assets/img/logo.svg";
import Email from "../../assets/img/email.svg";
import Phone from "../../assets/img/phone.svg";
import Instagram from "../../assets/img/instagram.svg";
import Facebook from "../../assets/img/facebook.svg";
import SearchIcon from "../../assets/img/search_icon.svg";
import LangIcon from "../../assets/img/language.svg";
import LoginIcon from "../../assets/img/login.svg";
import {ReactComponent as BurgerIcon} from "../../assets/img/burger.svg";
import {ReactComponent as SearchIconResposive} from "../../assets/img/search.svg";
import { Login } from "components";
import { useAuth } from "hooks";
import PersonIcon from "../../assets/img/person.svg";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Link } from "react-scroll";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

export const Header = () => {
  const { loginShow, setLoginShow, user } = useAuth();
  const [search, setSearch] = useState("");
  const [searchResault, setSearchResault] = useState([]);
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [insta, setInsta] = useState("");
  const [phone, setPhone] = useState("");

  const [langDrop, setLangDrop] = useState(false);
  const navBarHeight = 8*16;

  const [showNavResponsive , setShowNavResponsive] = useState(false);
  const [searchBarResponsive , setSearchBarResponsive] = useState(false);
  const [isLoadingSearch , setIsLoadingSearch] = useState(false);

  const {i18n} = useTranslation();

  const handleToggleLang = (e)=>{
    e.preventDefault();
    setLangDrop(!langDrop);
    setSearchBarResponsive(false);
    setShowNavResponsive(false);
  }

  
  const handleSelectLang = (lang) =>{
    i18n.changeLanguage(lang);
    setLangDrop(false);
    document.querySelector('html').setAttribute('lang', lang);
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }

  const handleBlur = () => {
    setSearch("");
  };

  const handleToggleNav = ()=>{
    setShowNavResponsive(!showNavResponsive);
    if(searchBarResponsive){setSearchBarResponsive(false)}
    if(langDrop){setLangDrop(false)}
  }

  const handleToggleSearch = ()=>{
    setSearchBarResponsive(!searchBarResponsive);
    if(showNavResponsive){setShowNavResponsive(false)}
    if(langDrop){setLangDrop(false)}
  }

  const handleSectionNav = () =>{
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    
      handleScroll();
    
  };
  useEffect(() => {
    const handleSerach = () => {
      if (!search) {
        setSearchResault([]);
        return;
      }
      setIsLoadingSearch(true);
      const url = `${process.env.REACT_APP_BASE_URL}/search-by-novels?search=${search}`;
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status) {
            setSearchResault(data.data);
          } else {
            setSearchResault([]);
          }
          setIsLoadingSearch(false);
        })
        .catch(()=>{
          setIsLoadingSearch(false);
        });
    };
    handleSerach();
  }, [search]);

  useEffect(() => {
    const fetchContent = () => {
      const url = `${process.env.REACT_APP_BASE_URL}/about-us-info`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setEmail(data.data.email);
          setFacebook(data.data.facebook);
          setInsta(data.data.instagram);
          setPhone(data.data.phone_number);
        });
    };
    fetchContent();
  }, []);

  const handleScroll = () => {
    setShowNavResponsive(false);
    // setSearchBarResponsive(false);
    setLangDrop(false);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header">
      {loginShow && <Login />}
      <div className={`lang-change ${langDrop ? 'active' : ''}`}>
        <ul>
          <li onClick={()=>{handleSelectLang('ar')}}>
            {t('Arabic')}
          </li>
          <li onClick={()=>{handleSelectLang('en')}}>
            {t('English')}
          </li>
        </ul>
      </div>
      <div className="top-nav">
        <nav className="nav container">
          <a href="/" className="nav__logo">
            <img src={Logo} alt="FA Novels" className="nav__logo-img" />
          </a>
          <div className="nav__menu">
            <div className="list">
              {email && 
                <a href={`mailto:${email}`} className="item">
                  <img src={Email} alt="Email" />
                </a>
              }

              {phone && 
                <a href={`tel:${phone}`} className="item">
                  <img src={Phone} alt="Phone" />
                </a>
              }
              
              {insta &&
                <a href={insta} className="item">
                  <img src={Instagram} alt="Instagram" />
                </a>
              }

              {facebook && 
                <a href={facebook} className="item">
                  <img src={Facebook} alt="Facebook" />
                </a>
              }
            </div>
            <div className={`search ${searchBarResponsive ? 'active' : ''}`} style={i18n.language === 'ar' ? { direction: 'rtl' } : {}} >
              
              {isLoadingSearch ? <FaSpinner className={`spinner icon ${i18n.language === 'ar' ? 'ar' : ''}`} /> : <img src={SearchIcon} className={`icon ${i18n.language === 'ar' ? 'ar' : ''}`} alt="search" />}
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onBlur={handleBlur}
                type="text"
                placeholder={t('SEARCH FOR TITLES')}
              />
              <div className="resaults">
                {searchResault.map((resault, key) => (
                  <div className="resault" key={key}>
                    <img
                      src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${resault.image}`}
                      alt=""
                    />
                    <div className="informations">
                      <h3>{resault.title}</h3>
                      <p>
                        {resault.price_after_discount ? (
                          <>
                            <span className="line-throw">{resault.price}</span>{" "}
                            {resault.price_after_discount + " " + t("SAR")}
                          </>
                        ) : (
                          resault.price + " " + t("SAR")
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="second-list">
              <a href="/lang" onClick={(e)=>{handleToggleLang(e)}} className="item lang-drop">
                <img src={LangIcon} alt={t("language")} />
              </a>
              {user ? (
                <a href="/dashboard" className="item auth">
                  <img src={PersonIcon} alt="profile" />
                </a>
              ) : (
                <a
                  href="/"
                  className="item auth"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginShow(true);
                  }}
                >
                  <img src={LoginIcon} alt="Email" />
                </a>
              )}
            </div>
          </div>
          <SearchIconResposive onClick={handleToggleSearch} className="search-mobile-icon"/>
          <BurgerIcon className={`menu-icon ${showNavResponsive ? 'active' : ''}`} onClick={handleToggleNav}/>
        </nav>
      </div>
      <div className={`bottom-nav ${showNavResponsive ? 'active' : ''}`}>
        <nav className="nav container">
          <ul className="list">
          <li>
            {user ? (
                <a href="/dashboard" className="item auth-mobile">
                  <img src={PersonIcon} alt="profile" />
                </a>
              ) : (
                <a
                  href="/"
                  className="item auth-mobile"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginShow(true);
                  }}
                >
                  <img src={LoginIcon} alt="Email" />
                </a>
              )}
            </li>
            <li className="item">
              <Link onClick={handleSectionNav} offset={-navBarHeight} to="home-section" smooth={true} duration={100} spy>
                {t("Home")}
              </Link>
            </li>
            <li className="item">
            <Link onClick={handleSectionNav} offset={-navBarHeight} to="categories-section" smooth={true} duration={100} spy>
                {t("Categories")}
              </Link>
            </li>
            <li className="item">
            <Link onClick={handleSectionNav} offset={-navBarHeight} to="about-section" smooth={true} duration={100} spy>
                {t("About Us")}
              </Link>
            </li>
            <li className="item">
            <Link onClick={handleSectionNav} offset={-navBarHeight} to="most-wanted-section" smooth={true} duration={100} spy>
                {t("Most Wanted")}
              </Link>
            </li>
            <li className="item">
              <Link onClick={handleSectionNav} offset={-navBarHeight} to="contact-section" smooth={true} duration={100} spy>
                {t("GET IN TOUCH")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
