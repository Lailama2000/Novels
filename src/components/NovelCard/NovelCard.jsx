import { useTranslation } from "react-i18next"
import {ReactComponent as FavIcon} from "../../assets/img/favorite.svg"
import { useState } from "react";

export const NovelCard = ({card,handleWishClick}) => {
    const {t} = useTranslation();
    const [isWishList , setIsWishList] = useState(card.is_wishlist);

    const handleCardWishClick = ()=>{
      handleWishClick();
      setIsWishList(!isWishList);
    }
  return (
    <a href={`/novel/${card.id}`}>
      <div className="card">
                <div className="card__image">
                  <img
                    src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${card.image}`}
                    alt={card.title}
                  />
                </div>
                <div className="card__title">
                  <h1>{card.title}</h1>
                </div>
                <div className="card__price">
                  <p>
                    {card.price_after_discount? (
                      <>
                      <span className="line-throw">{card.price}</span> {card.price_after_discount+ ' '+t('SAR')}
                      </>
                    ) : (
                      card.price +' '+ t('SAR')
                    )}
                  </p>
                </div>
                <div className="card__description">
                  <p>
                    {card.description}
                  </p>
                </div>
                <div className="card__fav">
                  <FavIcon onClick={(e)=>{ e.preventDefault();handleCardWishClick();}} className="icon" fill={isWishList ? '#F9AA10' : 'none'}/>
                </div>
              </div>
    </a>
  )
}
