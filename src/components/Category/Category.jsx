import i18next from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as SortIcon } from "../../assets/img/sort-icon.svg";
import { ReactComponent as PrevIcon } from "../../assets/img/navigate-prev.svg";
import { ReactComponent as NextIcon } from "../../assets/img/navigate-next.svg";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "components/Loader";
import { AddToWish } from "shared";
import { useAuth } from "hooks";
import { NovelCard } from "components/NovelCard";

export const Category = () => {
  const currentLang = i18next.language;
  const { t } = useTranslation();
  const params = useParams();
  const {bearerToken , setLoginShow} = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [categoryDetails, setCategoryDeatails] = useState([]);
  const [categoryNovels, setCategoryNovels] = useState([]);
  const [animateItems, setAnimateItems] = useState(false);
  const [sortMenu, setSortMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortOption, setSortOption] = useState("alphabet");
  const [isLoading, setIsLoading] = useState(false);

  const fetchContent = useCallback(() => {
    const options = {
      headers: {
        lang: currentLang,
        authorization: `Bearer ${bearerToken}`
      },
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/novels/${params.id}`, options)
      .then((response) => response.json())
      .then((data) => {
        setCategoryDeatails(data.data.category);
        setCategoryNovels(data.data.novels);
        setTotalItems(data.data.novels.length);
        console.log(data);
        window.scrollTo(0, 0);
      });
  }, [currentLang, params.id,bearerToken]);

  const sortedNovels = [...categoryNovels].sort((a, b) => {
    let aValue, bValue;

    switch (sortOption) {
      case "alphabet":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "rate":
        aValue = a.rate;
        bValue = b.rate;
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
    }

    if (sortOrder === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });
  const displayedItems = sortedNovels.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setAnimateItems(true);
  };

  const handleSortMenuToggle = () => {
    setSortMenu(!sortMenu);
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
    } else {
      setSortOption(option);
    }
    setSortMenu(false);
    setAnimateItems(true);
  };

  const handleWishClick = (id)=>{
    if(!bearerToken)
    {
      alert(t('You must be logged in'));
      setLoginShow(true);
      return
    }
    AddToWish(bearerToken,id);
  }

  //effects
  useEffect(() => {
    setIsLoading(true);
    fetchContent();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [fetchContent, setIsLoading]);

  useEffect(() => {
    setTimeout(() => {
      setAnimateItems(false);
      window.scrollTo(0, window.innerHeight);
    }, 0);
  }, [animateItems]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="category">
          <section className="cover">
            <div className="cover__overlay"></div>
            <div className="cover__image">
              <img
                src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${categoryDetails.cover_image}`}
                alt={categoryDetails.title}
              />
            </div>
            <div className="cover__title">
              <h1>{categoryDetails.title}</h1>
            </div>
          </section>
          <section className="novels">
            <div className={`filter-bar ${currentLang === 'ar' ? 'ar' : ''}`}>
              <div className="items-count">
                <h3>
                  {totalItems} {t("items found")}
                </h3>
              </div>
              <div className="filter">
                <SortIcon
                  className={`filter__icon ${
                    sortOrder === "desc" ? "" : "desc"
                  }`}
                  onClick={() => {
                    handleSortMenuToggle();
                  }}
                />
                <ul className={`filter__menu ${sortMenu ? "show" : ""}`}>
                  <li
                    className="filter__item"
                    onClick={() => {
                      handleSort("alphabet");
                    }}
                  >
                    <h3>{t("Alphabet")}</h3>
                  </li>
                  <li
                    className="filter__item"
                    onClick={() => {
                      handleSort("price");
                    }}
                  >
                    <h3>{t("Price")}</h3>
                  </li>
                  <li
                    className="filter__item"
                    onClick={() => {
                      handleSort("rate");
                    }}
                  >
                    <h3>{t("Rate")}</h3>
                  </li>
                </ul>
              </div>
            </div>

            <div className="novels-container">
              {displayedItems.map((card, key) => (
                // <div
                //   className={`card ${animateItems ? "fade-out" : ""}`}
                //   key={key}
                // >
                //   <div className="card__image">
                //     <img
                //       src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${card.image}`}
                //       alt={card.title}
                //     />
                //   </div>
                //   <div className="card__title">
                //     <h1>{card.title}</h1>
                //   </div>
                //   <div className="card__price">
                //     <p>
                //       {card.price_after_discount ? (
                //         <>
                //           <span className="line-throw">{card.price}</span>{" "}
                //           {card.price_after_discount + " " + t("SAR")}
                //         </>
                //       ) : (
                //         card.price + " " + t("SAR")
                //       )}
                //     </p>
                //   </div>
                //   <div className="card__description">
                //     <p>{card.description}</p>
                //   </div>
                //   <div className="card__fav">
                //     <FavIcon
                //       className="icon"
                //       fill={card.is_wishlist ? "#F9AA10" : "none"}
                //       onClick={()=>{handleWishClick(card.id)}}
                //     />
                //   </div>
                // </div>
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

            <div className="paginater">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="prev-button"
              >
                <PrevIcon className="icon" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="next-button"
              >
                <NextIcon className="icon" />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
