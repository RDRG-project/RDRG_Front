import React, { useEffect, useState } from 'react'
import './style.css'
import { useCookies } from 'react-cookie';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH } from '../../constants';
import path from 'path';

//                    type                    //
type Path = '대여' | '고객지원' | '';

//                    interface                    //
interface Props {
  path : Path;
}

//                    component                    //
function TopBar({path} : Props) {

  //                    function                    //
  const navigator = useNavigate();

  //                    event handler                    //
  const onLogInClickHandler = () => {
    navigator(AUTH_ABSOLUTE_PATH);
  };

  const onSignUpClickHandler = () => {
    navigator(AUTH_ABSOLUTE_PATH);
  };

  //                    render                    //
  return (
    <>
      <div className="logo-container">RDRG</div>
      <div className='top-bar-container'>
        <div className="top-bar-title">{ path }</div>
        <div className="top-bar-right">
          <div className="sign-in-button" onClick={onLogInClickHandler}>로그인</div>
          <div className="sign-up-button" onClick={onSignUpClickHandler}>회원가입</div>
        </div>
      </div>
    </>
  );
}

//                    component                    //
function TopNavigation ({path} : Props) {

  const rentClass = `top-navigation-item${path === '대여' ? ' active' : ''}`
  const customerSupportClass = `top-navigation-item${path === '고객지원' ? ' active' : ''}`

  //                    function                    //
  const navigator = useNavigate();

  //                    event handler                    //
  const onRentClickHandler = () => {navigator(RENT_ABSOLUTE_PATH)};
  const onCustomerSupportClickHandler = () => {navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH)};

  //                    render                    //
  return (
    <div className='top-navigation-container'>
        <div className={rentClass} onClick={onRentClickHandler}>
          <div className="top-navigation-title">대여</div>
        </div>
        <div className={customerSupportClass} onClick={onCustomerSupportClickHandler}>
          <div className="top-navigation-title">고객지원</div>
        </div>
    </div>
  )
}

export default function HomeContainer() {

  //                    state                    //
  const { pathname } = useLocation();
  const [path, setPath] = useState<Path>('');

  //                    function                    //
  const navigator = useNavigate();

  //                    effect                    //
  useEffect(() => {
    const path = 
      pathname === RENT_ABSOLUTE_PATH ? '대여' :
      pathname === CUSTOMER_SUPPORT_ABSOLUTE_PATH ? '고객지원' : '';

    setPath(path);
  },[pathname]);

  //                    render                    //
  return (
    <div id='wrapper'>
      <TopBar path = {path}/>
      <TopNavigation path={path}/>
      <div className='main-container'>
        <Outlet />
      </div>
    </div>
  );
}
