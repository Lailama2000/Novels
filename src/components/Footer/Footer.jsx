import { useTranslation } from "react-i18next"

export const Footer = () => {

    const {t} = useTranslation();
  return (
    <div className="footer">
        <div className="copy-right">
            <p>{t('Copyright 2024, All rights reserved')}</p> 
        </div>
        <div className="privacy">
            <a href="/privacy">
                {t('Privacy Policy')}
            </a>
        </div>
        <div className="powerd-by">
            <p>{t('Powered by')} <b><a href="https://smartedge.me/">{t('SmartEdge')}</a></b></p>
        </div>
    </div>  
  )
}
