import React, { useEffect, useState } from 'react'
import './style.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, HOME_CLAUSE_ABSOLUTE_PATH, HOME_COMPANY_ABSOLUTE_PATH, HOME_PLACE_ABSOLUTE_PATH, HOME_POLICY_ABSOLUTE_PATH, MYPAGE_PATH, MYPAGE_PROFILE_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH } from '../../constants';
import useUserStore from 'src/stores/user.store';
import { useCookies } from 'react-cookie';
import ResponseDto from 'src/apis/response.dto';
import { GetSignInUserResponseDto } from 'src/apis/user/dto/response';
import { getSignInUserRequest } from 'src/apis/user';
import useAuthenticationStore from 'src/stores/authentication.store';

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

    const { setAuthPage } = useAuthenticationStore();
    const { loginUserRole } = useUserStore();
    const [cookies, setCookie, removeCookie] = useCookies();

    const location = useLocation();
    const isAuthPage = location.pathname === AUTH_ABSOLUTE_PATH;

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onLogInClickHandler = () => {
      setAuthPage('sign-in');
      navigator(AUTH_ABSOLUTE_PATH);
    };

    const onSignUpClickHandler = () => {
      setAuthPage('sign-up');
      navigator(AUTH_ABSOLUTE_PATH);
    };

    const onLogoClickHandler = () => {navigator(HOME_ABSOLUTE_PATH);
    };

    const onRentClickHandler = () => {
      if (cookies.accessToken == null) {
        alert('로그인 해주세요.');
        navigator(AUTH_ABSOLUTE_PATH);
      } 
      else {
        navigator(RENT_ABSOLUTE_PATH)
      }
      
    };
    const onCustomerSupportClickHandler = () => {
      if (cookies.accessToken == null) {
        alert('로그인 해주세요.');
        navigator(AUTH_ABSOLUTE_PATH);
      }
      else {
        navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
      }
    };


    const onMypageClickHandler = () => {
      if (cookies.accessToken == null) {
          alert('로그인 해주세요.');
          navigator(AUTH_ABSOLUTE_PATH);
      } else {
          navigator(MYPAGE_PATH); // MYPAGE_PATH로 이동을 해서 MypageContainer에서 IF문으로 운영자인지 아닌지 확인하여 운영자면 대여내역 유저면 프로필로 이동 시켜주기 위해서 변경
      }
  };

    const onLogoutClickHandler = () => {
      removeCookie('accessToken', { path : '/'});
      navigator(HOME_ABSOLUTE_PATH);
    };

    //                    render                    //
    return (
      <div className='top-bar'>
        <div className="logo-container" onClick={onLogoClickHandler}>RDRG</div>
        <div className='top-navigation-container'>
          <div className={rentClass} onClick={onRentClickHandler}>
            {loginUserRole === 'ROLE_USER' || !cookies.accessToken ?
            <div className="top-navigation-title">대여</div> :
            <div className="top-navigation-title">기기 관리</div>
            }
          </div>
          <div className={customerSupportClass} onClick={onCustomerSupportClickHandler}>
            <div className="top-navigation-title">고객지원</div>
          </div>
          <div className={mypageSupportClass} onClick={onMypageClickHandler}>
            {loginUserRole === 'ROLE_USER' || !cookies.accessToken ? 
            <div className="top-navigation-title">마이페이지</div> :
            <div className="top-navigation-title">회원 관리</div>
            }
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

export default function HomeContainer() {

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

    //                event handler               //
    const onIntroductionClickHandler = () => {navigator(HOME_COMPANY_ABSOLUTE_PATH);
    }; 

    const onClauseClickHandler = () => {navigator(HOME_CLAUSE_ABSOLUTE_PATH);
    }; 

    const onPolicyClickHandler = () => {navigator(HOME_POLICY_ABSOLUTE_PATH);
    };

    const onPlaceClickHandler = () => {navigator(HOME_PLACE_ABSOLUTE_PATH);
    };

    const onCustomerSupportClickHandler = () => {navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH)
    };

    //                    render                    //
    return (
    <div id='rdrg-wrapper'>
        <TopBar  path={path}/>
        <div className='main-container'>
          <Outlet />
        </div>
        <div className='foot-bar'>
            <div className='foot-bar-menu'>
              <div className='foot-bar-menu-title' onClick={onIntroductionClickHandler}>회사소개</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title' onClick={onClauseClickHandler}>이용약관</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title' onClick={onPolicyClickHandler}>개인정보처리방침</div>
              <div className='foot-bar-line'></div>
              <div className='foot-bar-menu-title' onClick={onPlaceClickHandler}>지점안내</div>
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
                <div className='customer-service-shortcut' onClick={onCustomerSupportClickHandler}>고객센터 바로가기</div>
              </div>
            </div>
        </div>
    </div>
    );
}
