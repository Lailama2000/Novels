import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as DismissIcon } from "../../assets/img/dismiss.svg";
import { useAuth } from "hooks";
import i18next from "i18next";

export const RequestNovel = ({ NovelDetails, MainImage , HideRequest , Animations }) => {
  const { t } = useTranslation();
  const [couponCode,setCouponCode] = useState('');
  const [couponCodeError, setCouponCodeError] = useState(false);
  const [sentCoupon , setSentCoupon] = useState('');
  const [discount ,setDescount] = useState('');
  const [totalWithDiscount , setTotalWithDiscount] = useState('');
  const {bearerToken, setLoginShow} = useAuth();

  const handleCouponCodeChange = (e) =>{
    setCouponCode(e.target.value);
    setCouponCodeError(false);
  }

  const handleApplyCouponClick = () => {
    if(!couponCode)
    {
        setCouponCodeError(true);
        return;
    }
    if(!bearerToken)
    {
        alert('User Is not Logged In');
        return;
    }
    const url = `${process.env.REACT_APP_BASE_URL}/check-coupon?code=${couponCode}&novel_id=${NovelDetails.id}`;
    const options = {
        headers:{
            Authorization: `Bearer ${bearerToken}`,
        }
    };
    fetch(url,options)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        if(data.status)
        {
            console.log(data);
            setDescount(data.data.discount);
            setTotalWithDiscount(data.data.total_after_discount);
            setSentCoupon(couponCode);
        }
        else
        {
            setSentCoupon('');
            setDescount('');
            setTotalWithDiscount('');
            throw data.message;
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        alert(error);
    });
  }

  const handleConfirmClick = () =>{
    
    if(!bearerToken)
    {
        alert(t('User must be logged in'));
        setLoginShow(true);
        HideRequest();
        return;
    }
    const url = `${process.env.REACT_APP_BASE_URL}/checkout`;
    const body = {
        'novel_id': NovelDetails.id,
        ...(sentCoupon && { 'promo_code': sentCoupon }),
    };
    const options = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
        },
        body:JSON.stringify(body)
    };

    fetch(url,options)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        if(data.status)
        {
            setCouponCode('');
            setSentCoupon('');
            const url = data.data.payment_session_url
            HideRequest();
            window.location.href = url;
        }
        else{
            HideRequest();
            throw data.message;
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        alert(error);
    });

  }
  return (
    <div className={`request-novel ${Animations ? 'fade' : ''} ${i18next.language === 'ar' ? 'ar' : ''}`}>
      <div className="card">
        <div className="card__header">
          <h1>{t("Confirm Purchase")}</h1>
          <DismissIcon className="dismiss-icon" onClick={HideRequest} />
        </div>

        <div className="card__informations">
          <div className="image-background">
            {MainImage && (
              <img
                src={`${process.env.REACT_APP_LARAVEL_BASE_URL}/${MainImage}`}
                alt={NovelDetails.title}
              />
            )}
          </div>
          <div className="titles">
            <h2>{NovelDetails.title}</h2>
            <p>{NovelDetails.author_name}</p>
          </div>
        </div>

        <div className="card__redeem">
            <div className="redeem-header">
                <h2>
                    {t('Redeem Code')}
                </h2>
            </div>
            <div className={`redeem-apply ${couponCodeError ? 'error' : ''}`}>
                <input type="text" value={couponCode} onChange={(e)=>{handleCouponCodeChange(e)}} />
                <button className="apply-button" onClick={()=>{handleApplyCouponClick()}}>
                    {t('Apply')}
                </button>
            </div>

        </div>

        <div className="card__balance">
            <div className="subtotal">
            <h2 className="title">
                    {totalWithDiscount ? t('Subtotal') : t('Total')}
                </h2>
                <h2 className="value">
                    {NovelDetails.price_after_discount ? "SAR"+ NovelDetails.price_after_discount : NovelDetails.price && "SAR"+NovelDetails.price}
                </h2>
            </div>
            {discount && 
                <div className="discount">
                <h2 className="title">
                        {t('Discount')}
                    </h2>
                    <h2 className="value">
                        SAR{discount}
                    </h2>
                </div>
            }
            {totalWithDiscount && 
                <div className="total">
                    <h2 className="title">
                        {t('Total')}
                    </h2>
                    <h2 className="value">
                        SAR{totalWithDiscount}
                    </h2>
                </div>
            }
            
        </div>

        {/* <div className="card__payment">
            <h2>
                {t('Payment Details')}
            </h2>
            <div className={`number-card ${cardNumberError ? 'error' : ''}`}>
                <input type="text" placeholder={t('Card Number')} value={cardNumber} onChange={(e)=>{setCardNumber(e.target.value); setCardNumberError(false);}} />
            </div>
            <div className="info-card">
                <div className={`exp ${expiryDateError ? 'error' : ''}`}>
                    <input type="text" placeholder={t('Exp. Date')} value={expiryDate} onChange={(e)=>{setExpiryDate(e.target.value); setExpiryDateError(false);}} />
                </div>
                <div className={`cvv ${cvvError ? 'error' : ''}`}>
                    <input type="text" placeholder={t('CVV')} value={cvv} onChange={(e)=>{setCvv(e.target.value); setCvvError(false);}} />
                </div>
            </div>
        </div> */}
        
        <div className="card__notice">
            <p>
                {t('By selecting [Confirm Purchase], you agree to complete the purchase in Accordance with the Terms of Service before using this content.')}
            </p>
        </div>

        <button className="card__confirm" onClick={()=>{handleConfirmClick()}}>
            {t('Confirm Purchase')}
        </button>
      </div>
    </div>
  );
};
