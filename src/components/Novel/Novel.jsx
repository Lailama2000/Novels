import i18next from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as StarIcon } from "../../assets/img/star.svg";
import { ReactComponent as FaveIcon } from "../../assets/img/favorite-border.svg";
import { ReactComponent as UserCircleIcon } from "../../assets/img/user-circle.svg";
import { useAuth } from "hooks";
import { AddToWish } from "shared";
import { RequestNovel } from "components/RequestNovel";
import { Link, useParams } from "react-router-dom";
import { Loader } from "components/Loader";

export const Novel = () => {
  const currentLang = i18next.language;
  const { t } = useTranslation();
  const params = useParams();
  const [novelDetails, setNovelDetails] = useState({
    id: "",
    title: "",
    description: "",
    author_name: "",
    images: [],
    price: 0,
    price_after_discount: 0,
    is_wishlist: false,
    is_requested: false,
    is_paid: false,
    ratings: [],
    average_rating: 0,
    ratings_count: 0,
  });
  const [novelRating, setNovelRating] = useState(0);
  const [novelImages, setNovelImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [ratings, setRatings] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [showRequestAnimations, setShowRequestAnimations] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { bearerToken ,setLoginShow } = useAuth();
  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleAddToWishClick = () => {
    if(!bearerToken)
    {
      alert(t('You must be logged in'));
      setLoginShow(true);
      return
    }
    AddToWish(bearerToken, params.id);
    setNovelDetails((prev) => ({
      ...prev,
      is_wishlist: !novelDetails.is_wishlist,
    }));
  };

  const handleRequestNowClick = () => {
    setShowRequestAnimations(true);
    setTimeout(() => {
      setShowRequest(true);
      setShowRequestAnimations(false);
    }, 300);
  };

  const handelRequestHide = () => {
    setShowRequestAnimations(true);
    setTimeout(() => {
      setShowRequest(false);
      setShowRequestAnimations(false);
    }, 300);
  };

  const fetchContent = useCallback(() => {
    const options = {
      headers: {
        lang: currentLang,
        authorization: `Bearer ${bearerToken}`,
      },
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/novel/${params.id}`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setNovelDetails(data.data);
        setNovelRating(parseInt(data.data.average_rating));
        const fetchedImages = data.data.images;
        setNovelImages(fetchedImages);
        if (fetchedImages.length > 0) {
          setMainImage(fetchedImages[0]);
        }
        setRatings(data.data.ratings);
        setIsPaid(data.data.is_paid);
      });
  }, [currentLang, params.id, bearerToken]);

  //Effects

  useEffect(() => {
    setIsLoading(true);
    fetchContent();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [fetchContent]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showRequest && (
            <RequestNovel
              NovelDetails={novelDetails}
              MainImage={mainImage}
              HideRequest={handelRequestHide}
              Animations={showRequestAnimations}
            />
          )}
          <div className="novel">
            <section className="details">
              <div className="details__images">
                <div className="main-container">
                  {mainImage && (
                    <img
                      src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${mainImage}`}
                      alt={novelDetails.title}
                    />
                  )}
                </div>
                <div className="pagination">
                  {novelImages.slice(0, 4).map((image, index) => (
                    <div
                      className={`card ${mainImage === image ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${image}`}
                        alt={novelDetails.title}
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="details__content">
                <h1 className="title">{novelDetails.title}</h1>
                <h3 className="author">{novelDetails.author_name}</h3>
                <h3 className="author">{novelDetails.price_after_discount ? novelDetails.price_after_discount : novelDetails.price} SAR</h3>
                <div className="rating">
                  <div className="stars">
                    {[...Array(novelRating)].map((_, index) => (
                      <StarIcon key={index} />
                    ))}
                  </div>
                  <div className="count">
                    <p>
                      ({novelDetails.ratings_count} {t("ratings")})
                    </p>
                  </div>
                </div>

                <div className="description">
                  <p>{novelDetails.description}</p>
                </div>
                {isPaid ? (
                  <Link className="show" to="/dashboard/novels">
                    {t("Show")}
                  </Link>
                ) : (
                  <button
                    className="request"
                    onClick={() => {
                      handleRequestNowClick();
                    }}
                  >
                    {t("Request Now")}
                  </button>
                )}
              </div>

              <button
                className={`details__wish ${
                  novelDetails.is_wishlist ? "active" : ""
                }`}
                onClick={() => {
                  handleAddToWishClick();
                }}
              >
                <FaveIcon />
                {t("Wish List")}
              </button>
            </section>
            {ratings.length >= 5 && (
              <section className="reviews">
                <div className={`reviews-heading ${currentLang === 'ar' ? 'ar' : ''}`}>
                  <h1>{t("Customer Reviews")}</h1>
                  <h3>
                    {novelDetails.ratings_count
                      ? novelDetails.ratings_count
                      : "0"}{" "}
                    {t("Reviews")}{" "}
                    {novelDetails.average_rating
                      ? `(${novelDetails.average_rating} ${t('Stars')})`
                      : "0"}
                  </h3>
                </div>
                <div className="reviews-body">
                  {ratings.map((rating, key) => (
                    <div className="review" key={key}>
                      <div className="review-header">
                        <UserCircleIcon className="user-icon" />
                        <h3>{rating.username}</h3>
                        <div className="stars">
                          {[
                            ...Array(parseInt(novelDetails.average_rating)),
                          ].map((_, index) => (
                            <StarIcon key={index} />
                          ))}
                        </div>
                      </div>
                      <div className="review-body">{rating.comment}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </>
  );
};
