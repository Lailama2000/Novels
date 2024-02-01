import { useTranslation } from "react-i18next";
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";
import { ReactComponent as Star } from "../../assets/img/rate-star.svg";
import { useAuth } from "hooks";
import { useCallback, useEffect, useState } from "react";
import i18next from "i18next";

export const RateNovel = ({ NovelId , HandleHideRate}) => {
  const { t } = useTranslation();
  const { bearerToken } = useAuth();
  const [rating, setRating] = useState(0);
  const [filledStars, setFilledStars] = useState(Array(5).fill(false));
  const [note ,setNote] = useState('');

  const handleStarHover = (index) => {
    const updatedFilledStars = filledStars.map(
      (star, i) => i <= index || i <= rating - 1
    );
    setFilledStars(updatedFilledStars);
  };
  const handleStarLeave = () => {
    const updatedFilledStars = filledStars.map((star, i) => i < rating);
    setFilledStars(updatedFilledStars);
  };

  const handleStarClick = (index) => {
    const updatedFilledStars = filledStars.map((star, i) => i <= index);
    setFilledStars(updatedFilledStars);
    setRating(index+1);
  };

  const handleSubmitClick = ()=>{
    const url = `${process.env.REACT_APP_BASE_URL}/rating`
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`
    };
    const body = {
        novel_id: NovelId,
        stars: rating,
        comment: note
    };
    const options = {
        method:'POST',
        headers:headers,
        body:JSON.stringify(body)
    }
    fetch(url,options)
    .then((response)=>response.json())
    .then((data)=>{
        if(data.status)
        {
            HandleHideRate();
        }
        else
        {
            throw data.message;
        }
    })
    .catch((error)=>{
        console.error(error);
    })
  }

  const fetchContent = useCallback(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/get-rate?novel_id=${NovelId}`;
    const options = {
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          if (data.data !== null) {
            const fetchedRating = data.data.stars;
            const fetchedNote = data.data.comment;
            setRating(fetchedRating);
            setNote(fetchedNote);
            const updatedFilledStars = filledStars.map(
              (star, i) => i < fetchedRating
            );

            setFilledStars(updatedFilledStars);
          }
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line
  }, [bearerToken, NovelId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);
  return (
    <div className={`rate-novel ${i18next.language === 'ar' ? 'ar' : ''}`}>
      <div className="popup">
        <DismissIcon className="popup__dismiss" onClick={HandleHideRate} />
        <div className="popup__heading">
          <h2>{t("Rate Novel")}</h2>
        </div>

        <div className="popup__stars">
          {filledStars.map((isFilled, index) => (
            <div
              className="box"
              onMouseEnter={() => {
                handleStarHover(index);
              }}
              onMouseLeave={handleStarLeave}
              onClick={() => {
                handleStarClick(index);
              }}
            >
              <Star fill={isFilled ? "#F9AA10" : "none"} key={index} />
            </div>
          ))}
        </div>
        <div className="popup__notes">
            <textarea value={note} onChange={(e)=>{setNote(e.target.value)}}>

            </textarea>
        </div>
        <button onClick={handleSubmitClick} className="popup__submit">
            {t('Rate')}
        </button>
      </div>
    </div>
  );
};
