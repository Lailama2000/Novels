import { t } from 'i18next';
import Cover from '../../assets/img/privacy.png';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { Loader } from 'components/Loader';

export const Privacy = () => {
    const currentLang = i18next.language;
    const [htmlContent , setHtmlContent] = useState(``);
    const [isLoading , setIsLoading] = useState(false);
    useEffect(()=>{
        const fetchContent = ()=>{
            const url = `${process.env.REACT_APP_BASE_URL}/privacy-policy`;
            const headers = {
                lang:currentLang
            }
            const options = {
                headers:headers,
            }
            fetch(url,options)
            .then((response)=>response.json())
            .then((data)=>{
                if(data.status){
                    setHtmlContent(data.data.privacy_policy);
                }
            })
        }
        setIsLoading(true);
        fetchContent();
        setTimeout(() => {
            setIsLoading(false);
          }, 2000);
    },[currentLang])
  return (
    <>
    {isLoading ?
    <Loader/>
    :
    <div className="privacy">
        <div className="cover">
            <div className="overlay"></div>
            <img src={Cover} alt={t('Privacy Policy')} />
            <h1 className="title">
                {t('Privacy Policy')}
            </h1>
        </div>
        <div className="content">
        <div style={{all:'unset',}}  dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    </div>
    }
    </>
    
  )
}
