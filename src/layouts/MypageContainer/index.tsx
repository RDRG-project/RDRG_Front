import React, { useEffect, useState } from 'react'
import './style.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { MYPAGE_PROFILE_ABSOLUTE_PATH, MYPAGE_RENT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { useUserStore } from 'src/stores';

//                    type                    //
type Path = '프로필 관리' | '대여 내역' | '';

//                    interface                    //
interface Props {
  path : Path;
}

//                    component                    //
function SideNavigation ({path} : Props) {

    const profileClass = `mypage-navigation-item${path === '프로필 관리' ? ' active' : ''}`
    const rentDetailClass = `mypage-navigation-item${path === '대여 내역' ? ' active' : ''}`
  
    const { pathname } = useLocation();
    const { loginUserRole } = useUserStore();
  
    //                    function                    //
    const navigator = useNavigate();
    
  
    //                    event handler                    //
    const onProfileClickHandler = () => {navigator(MYPAGE_PROFILE_ABSOLUTE_PATH)};
    const onRentDetailClickHandler = () => {navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH)};
  
    //                    render                    //
    if (loginUserRole !== 'ROLE_ADMIN') {
    return (
      <div className="mypage-navigation-container">
        <div className={profileClass} onClick={onProfileClickHandler}>
          <div className="mypage-navigation-title">프로필 관리</div>
        </div>
        <div className={rentDetailClass} onClick={onRentDetailClickHandler}>
          <div className="mypage-navigation-title">대여 내역</div>
        </div>
      </div>
    );
    } else {
      return (
      <div className="mypage-navigation-container">
        <div className={rentDetailClass} onClick={onRentDetailClickHandler}>
        <div className="mypage-navigation-title">대여 내역</div>
        </div>
        <div className={profileClass} onClick={onProfileClickHandler}>
          <div className="mypage-navigation-title">프로필 관리</div>
        </div>
      </div>
      );
    }
  }

export default function MypageContainer() {

  //                    state                    //
    const { pathname } = useLocation();
//   const {setLoginUserId, setLoginUserRole} = useUserStore();
//   const [cookies] = useCookies();
    const [path, setPath] = useState<Path>('');

    const {loginUserRole} = useUserStore();

  //                    function                    //
  const navigator = useNavigate();

//   const getSignInUserResponse = (result : GetSignInUserResponseDto | ResponseDto | null) => {

//     const message = 
//       !result ? '서버에 문제가 있습니다.' :
//       result.code === 'AF' ? '인증에 실패했습니다.' :
//       result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
//     if (!result || result.code !== 'SU') {
//       alert(message);
//       navigator(AUTH_ABSOLUTE_PATH);
//       return;
//     }

//     const {userId, userRole} = result as GetSignInUserResponseDto;
//     setLoginUserId(userId);
//     setLoginUserRole(userRole);
//   };

  //                    effect                    //
  useEffect(() => {
    const path = 
      pathname === MYPAGE_PROFILE_ABSOLUTE_PATH ? '프로필 관리' :
      pathname === MYPAGE_RENT_DETAIL_ABSOLUTE_PATH ? '대여 내역' : '';

    setPath(path);
  },[pathname]);

  useEffect(() => { // 관리자면 대여내역으로 이동 유저면 프로필로 이동
    if (pathname === '/rdrg/mypage') {
      if (loginUserRole === 'ROLE_ADMIN') {        
        navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH);
      } else {
        navigator(MYPAGE_PROFILE_ABSOLUTE_PATH);
      }
    }
  }, [loginUserRole, pathname, navigator]);


//   useEffect(() => {
//     if (!cookies.accessToken) {
//       navigator(AUTH_ABSOLUTE_PATH);
//       return;
//     }

//     getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
//   },[cookies.accessToken]);

  //                    render                    //
  return (
    <div id="mypage-wrapper">
      <div className='mypage-image'>마이페이지</div>
      <SideNavigation path= {path}/>
      <div className="mypage-main-container">
        <Outlet />
      </div>
    </div>
  )
}
