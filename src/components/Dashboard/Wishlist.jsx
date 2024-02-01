import { Loader } from "components/Loader";
import { NovelCard } from "components/NovelCard";
import { useAuth } from "hooks";
import i18next, { t } from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { AddToWish } from "shared";

export const Wishlist = () => {
  const { bearerToken } = useAuth();
  const currentLang = i18next.language;

  const [novels, setNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorFetching , setErrorFetching] = useState('');

  const handleWishClick = (token, id) => {
    AddToWish(token, id);
    const updatedNovels = novels.filter((novel) => novel.id !== id);
    setNovels(updatedNovels);
  };
  const fetchContent = useCallback(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/get-wishlist`;
    const headers = {
      authorization: `Bearer ${bearerToken}`,
      lang:currentLang,
    };
    const options = {
      headers: headers,
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          const fetchedNovels = data.data;
          setNovels(fetchedNovels);
          setErrorFetching('');
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        setErrorFetching(t('Somthing went wrong please check your internet connection or try again later'));
        console.error(error);
      });
  }, [bearerToken,currentLang]);

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
        <div className="wishlist">
          {errorFetching && <p style={{color:"red" , background:"white" , borderRadius:"0.5rem" , padding:"1rem"}}>{errorFetching}</p>}
          {novels.map((card, key) => (
            <NovelCard
              card={card}
              key={key}
              token={bearerToken}
              handleWishClick={()=>{handleWishClick(bearerToken,card.id)}}
            />
          ))}
        </div>
      )}
    </>
  );
};
