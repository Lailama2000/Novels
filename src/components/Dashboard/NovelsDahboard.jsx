import { useAuth } from "hooks";
import i18next from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { NovelPdf } from "./NovelPdf";
import { Loader } from "components/Loader";
import { t } from "i18next";

export const NovelsDahboard = () => {
  const currentLang = i18next.language;
  const { bearerToken } = useAuth();
  const [boughtNovels, setBoughtNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [isLoading , setIsLoading] = useState(false);
  const [errorFetching , setErrorFetching] = useState('');

  const fetchContent = useCallback(() => {
    const headers = {
      lang: currentLang,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };
    const options = {
      headers: headers,
    };
    const url = `${process.env.REACT_APP_BASE_URL}/get-bought-novels`;
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          console.log(data);
          setBoughtNovels(data.data);
          setErrorFetching('');
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        setErrorFetching(t('Somthing went wrong please check your internet connection or try again later'));
        console.error("Error fetching data:", error);
      });
  }, [currentLang, bearerToken]);

  const handleCardClick = (card) => {
    setSelectedNovel(card);
  };

  const handleBackClick = () => {
    setSelectedNovel(null);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchContent();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [fetchContent]);
  return selectedNovel ? (
    <NovelPdf card={selectedNovel} HandleBackClick={handleBackClick} />
  ) : (
    <>
    {
      isLoading ? <Loader/>
      :
      <div className="dashboard-novels">
        {errorFetching && <p style={{color:"red" , background:"white" , borderRadius:"0.5rem" , padding:"1rem"}}>{errorFetching}</p>}
      {boughtNovels.map((card, key) => (
        <div
          className="card"
          key={key}
          onClick={() => {
            handleCardClick(card);
          }}
        >
          <div className="card__image">
            <img
              src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${card.image}`}
              alt={card.title}
            />
          </div>
          <div className="card__title">
            <h3>{card.title}</h3>
          </div>
        </div>
      ))}
    </div>
    }
    </>
    
  );
};
