import React, { useEffect, useState } from 'react'
import './style.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, MYPAGE_PROFILE_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH } from '../../constants';
import path from 'path';
import useUserStore from 'src/stores/user.store';
import { useCookies } from 'react-cookie';
import ResponseDto from 'src/apis/response.dto';
import { GetSignInUserResponseDto } from 'src/apis/user/dto/response';
import { getSignInUserRequest } from 'src/apis/user';

//                    type                    //
type Path = '대여' | '고객지원' | '마이페이지' | '';

//                    interface                    //
interface Props {
    path : Path;
}

//                    component                    //
function TopBar({path} : Props) {

    const rentClass = `top-navigation-item${path === '대여' ? ' active' : ''}`
    const customerSupportClass = `top-navigation-item${path === '고객지원' ? ' active' : ''}`
    const mypageSupportClass = `top-navigation-item${path === '마이페이지' ? ' active' : ''}`

    //                    state                    //
    const { loginUserRole } = useUserStore();
    const [cookies, setCookie, removeCookie] = useCookies();

    const location = useLocation();

    //                    function                    //
    const navigator = useNavigate();
    
    const isAuthPage = location.pathname === AUTH_ABSOLUTE_PATH || location.pathname === SIGN_UP_ABSOLUTE_PATH;

    //                    event handler                    //
    const onLogInClickHandler = () => {
      navigator(AUTH_ABSOLUTE_PATH);
    };

    const onSignUpClickHandler = () => {navigator(SIGN_UP_ABSOLUTE_PATH);
    };

    const onLogoClickHandler = () => {navigator(HOME_ABSOLUTE_PATH);
    };

    const onRentClickHandler = () => {navigator(RENT_ABSOLUTE_PATH)};
    const onCustomerSupportClickHandler = () => {navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH)};
    const onMypageClickHandler = () => {navigator(MYPAGE_PROFILE_ABSOLUTE_PATH)};

    const onLogoutClickHandler = () => {
      removeCookie('accessToken', { path : '/'});
      navigator(HOME_ABSOLUTE_PATH);
    };

    //                    render                    //
    // const buttonClass =  

    return (
      <div className='top-bar'>
        <div className="logo-container" onClick={onLogoClickHandler}>RDRG</div>
        <div className='top-navigation-container'>
          <div className={rentClass} onClick={onRentClickHandler}>
            <div className="top-navigation-title">대여</div>
          </div>
          <div className={customerSupportClass} onClick={onCustomerSupportClickHandler}>
            <div className="top-navigation-title">고객지원</div>
          </div>
          <div className={mypageSupportClass} onClick={onMypageClickHandler}>
            <div className="top-navigation-title">마이페이지</div>
          </div>
        </div>
        <div className="top-bar-right">
          {!cookies.accessToken && !isAuthPage ? (
            <>
              <div className='sign-in-button' onClick={onLogInClickHandler}>로그인</div>
              <div className='sign-up-button' onClick={onSignUpClickHandler}>회원가입</div>
            </>
            ) : !isAuthPage && loginUserRole === 'ROLE_ADMIN' ? (
            <>
              <div className="top-bar-role">관리자</div>
              <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
            </>
            ) : !isAuthPage ? (
              <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
            ) : null}
        </div>
      </div>
    );
}

export default function RdrgContainer() {

    //                    state                    //
    const { pathname } = useLocation();
    const {setLoginUserId, setLoginUserRole} = useUserStore();
    const [cookies] = useCookies();
    const [path, setPath] = useState<Path>('');

    //                    function                    //
    const navigator = useNavigate();

    const getSignInUserResponse = (result : GetSignInUserResponseDto | ResponseDto | null) => {

      const message = 
        !result ? '서버에 문제가 있습니다.' :
        result.code === 'AF' ? '인증에 실패했습니다.' :
        result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
      
      if (!result || result.code !== 'SU') {
        alert(message);
        navigator(AUTH_ABSOLUTE_PATH);
        return;
      }
  
      const {userId, userRole} = result as GetSignInUserResponseDto;
      setLoginUserId(userId);
      setLoginUserRole(userRole);
    };

    //                    effect                    //
    useEffect(() => {
    const path = 
        pathname === RENT_ABSOLUTE_PATH ? '대여' :
        pathname === CUSTOMER_SUPPORT_ABSOLUTE_PATH ? '고객지원' :
        pathname === MYPAGE_PROFILE_ABSOLUTE_PATH ? '마이페이지' : '';

    setPath(path);
    },[pathname]);

    useEffect(() => {
      if (!cookies.accessToken) {
        navigator(HOME_ABSOLUTE_PATH);
        return;
      }
  
      getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    },[cookies.accessToken]);

    //                    render                    //
    return (
    <div id='rdrg-wrapper'>
        <TopBar  path={path}/>
        <div className='main-container'>
          <Outlet />
        </div>
        <div className='foot-bar'>
            <div className='foot-bar-menu'>
              <div className='foot-bar-menu-title'>회사소개</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title'>이용약관</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title'>개인정보처리방침</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title'>지점안내</div>
            </div>
            <div className='foot-bar-content'>
              <div className='foot-bar-content-information'>
                <div className='company-title'>(주) RDRG회사</div>
                <div className='company-information'>
                  <div className='company-representative'>대표 : RDRG </div>
                  <div className='foot-bar-line'></div>
                  <div className='company-address'>부산광역시 부산진구 중앙대로 668</div>
                  <div className='foot-bar-line'></div>
                  <div className='company-business-registration-number'>사업자 등록번호 : 222-11-000333</div>
                </div>
                <div className='company-information'>
                  <div className='company-report'>통신판매업신고 : 2024-부산부전동-8888</div>
                  <div className='foot-bar-line'></div>
                  <div className='company-email'>E-mail : rdrg@email.com</div>
                </div>
                <div className='company-reword'>소비자피해보상</div>
                <div className='company-reword-content'>고객님은 안전거래를 위해 현금 등으로 결제 시 저희 업체에서 가입한 구매 안전 서비스로 소비자 피해보상 보험 서비스를 이용할 수 있습니다.</div>
                <div className='company-copyright'>Copyright © 2024RDRG. All Rights Reserved.</div>
              </div>
              <div className='customer-service'>
                <div className='customer-service-title'>고객센터</div>
                <div className='customer-service-time'>운영시간 : 평일 09:00~18:00</div>
                <div className='customer-service-shortcut'>고객센터 바로가기</div>
              </div>
            </div>
        </div>
    </div>
    );
}
