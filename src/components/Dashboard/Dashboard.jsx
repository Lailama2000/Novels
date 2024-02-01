import { useAuth } from 'hooks';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import {ReactComponent as UserCircleIcon} from '../../assets/img/user-circle.svg';
import {ReactComponent as Logo} from '../../assets/img/logo-dashboard.svg';
import {ReactComponent as NovelIcon} from '../../assets/img/novels-icon.svg';
import {ReactComponent as HeartIcon} from '../../assets/img/heart-icon.svg';
import {ReactComponent as HeadphoneIcon} from '../../assets/img/headphones-icon.svg';
import {ReactComponent as ProfileIcon} from '../../assets/img/profile-dashboard-icon.svg';
import {ReactComponent as LogoutIcon} from '../../assets/img/logout.svg';
import {ReactComponent as BurgerIcon} from '../../assets/img/burger.svg';
import '../../assets/scss/components/_dashboard.scss';
import i18next from 'i18next';

export const Dashboard = () => {
    const {t} = useTranslation();
    const {user,logout} = useAuth();
    const location = useLocation();
    const [sideBarActive , setSideBarActive] = useState(false);

    const handleToggleSideBar = ()=>{
        setSideBarActive(!sideBarActive);
    }

    const handleLogoutClick = (e) =>{
        e.preventDefault();
        logout();
    }
    useEffect(() => {
    document.body.classList.add('dashboard-body');

    return () => {
        document.body.classList.remove('dashboard-body');
    };
    }, []);
  if(!user)
  {
    return <Navigate to='/'/>
  }
  else
  {
    return (
        <div className={`dashboard ${i18next.language === 'ar' ? 'ar' : ''}`}>
            <header className='dashboard__header'>
                <h1>
                    {t('Welcome')}, {user.name}!
                </h1>
                <div className="username">
                    <UserCircleIcon/>
                    <p>
                        {user.name}
                    </p>
                </div>

                <BurgerIcon onClick={handleToggleSideBar} className='nav-icon'/>
            </header>
            <div className={`dashboard__sidebar ${sideBarActive ? 'active' : ''}`}>
                <div className="list">
                    <a href="/">
                        <Logo/>
                    </a>
                    <BurgerIcon onClick={handleToggleSideBar} className='menu-icon'/>
                    <div onClick={handleToggleSideBar} className={`link ${location.pathname === '/dashboard/novels' ||location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <NovelIcon/>
                        <NavLink to="/dashboard/novels">
                            <p>
                                {t('Novels')}
                            </p>
                        </NavLink>
                    </div>
                    <div onClick={handleToggleSideBar} className={`link ${location.pathname === '/dashboard/wishlist' ? 'active' : ''}`}>
                        <HeartIcon/>
                        <NavLink to="/dashboard/wishlist">
                            <p>
                                {t('Wishlist')}
                            </p>
                        </NavLink>
                    </div>
                    <div onClick={handleToggleSideBar} className={`link ${location.pathname === '/dashboard/support' ? 'active' : ''}`}>
                        <HeadphoneIcon/>
                        <NavLink to="/dashboard/support">
                            <p>
                                {t('Support')}
                            </p>
                        </NavLink>
                    </div>
                    <div onClick={handleToggleSideBar} className={`link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}>
                        <ProfileIcon/>
                        <NavLink to="/dashboard/profile">
                            <p>
                                {t('Profile')}
                            </p>
                        </NavLink>
                    </div>
                </div>

                <div className="bar-bottom">
                    <div className="logout">
                        <LogoutIcon/>
                        <a href="/logout" onClick={(e)=>{handleLogoutClick(e)}}>
                            <p>
                                {t('Logout')}
                            </p>
                        </a>
                    </div>

                    <div className="powerd-by">
                        <p>
                            {t('Powered by')} <b>{t('SmartEdge')}</b>
                        </p>
                    </div>
                </div>

                
            </div>
            <Outlet/>
        </div>
    )
  }
}
