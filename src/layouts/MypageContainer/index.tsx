import React, { useEffect, useState } from 'react'
import './style.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { MYPAGE_PROFILE_ABSOLUTE_PATH, MYPAGE_RENT_DETAIL_ABSOLUTE_PATH } from 'src/constants';

//                    type                    //
type Path = '프로필 관리' | '대여 내역' | '';

//                    interface                    //
interface Props {
  path : Path;
}

//                    component                    //
function SideNavigation ({path} : Props) {

    const profileClass = `side-navigation-item${path === '프로필 관리' ? ' active' : ''}`
    const rentDetailClass = `side-navigation-item${path === '대여 내역' ? ' active' : ''}`
  
    const { pathname } = useLocation();
  
    //                    function                    //
    const navigator = useNavigate();
  
    //                    event handler                    //
    const onProfileClickHandler = () => {navigator(MYPAGE_PROFILE_ABSOLUTE_PATH)};
    const onRentDetailClickHandler = () => {navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH)};
  
    //                    render                    //
    return (
      <div className="side-navigation-container">
        <div className={profileClass} onClick={onProfileClickHandler}>
          <div className="side-navigation-title">프로필 관리</div>
        </div>
        <div className={rentDetailClass} onClick={onRentDetailClickHandler}>
          <div className="side-navigation-title">대여 내역</div>
        </div>
      </div>
    )
  }

export default function MypageContainer() {

  //                    state                    //
    const { pathname } = useLocation();
//   const {setLoginUserId, setLoginUserRole} = useUserStore();
//   const [cookies] = useCookies();
    const [path, setPath] = useState<Path>('');

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
      <SideNavigation path= {path}/>
      <div className="mypage-main-container">
        <Outlet />
      </div>
    </div>
  )
}
