import { useEffect, useState } from "react";
import "./style.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import useUserStore from "src/stores/user.store"
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, MYPAGE_PROFILE_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH } from "src/constants";

type Path = '대여' | '고객지원' | '마이페이지' |'';

//                    interface                    //
interface Props {
    path: Path;
}

//                    component                    //
function TopBar({ path }: Props) {

    //                    state                    //
    const [cookies, setCookie, removeCookie] = useCookies();
    const { loginUserRole } = useUserStore();

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    
    const onLogoClickHandler = () => {navigator(HOME_ABSOLUTE_PATH);
    };

    const onLogoutClickHandler = () => {
        removeCookie('accessToken', { path: '/' });
        navigator(AUTH_ABSOLUTE_PATH);
    };


    //                    render                    //
    return (
    <div className="top-bar">
        <div className="logo-container" onClick={onLogoClickHandler}>RDRG</div>
        <div className="top-bar-container">
            <div className="top-bar-title">{ path }</div>
            <div className="top-bar-right">
                { loginUserRole === 'ROLE_ADMIN' && <div className="top-bar-role">관리자</div> }
                <div className="second-button" onClick={onLogoutClickHandler}>로그아웃</div>
            </div>
        </div>
        </div>
    );
}

//                    component                    //
function SideNavigation({ path }: Props) {

    const rentClass = `top-navigation-item${path === '대여' ? ' active' : ''}`
    const customerSupportClass = `top-navigation-item${path === '고객지원' ? ' active' : ''}`
    const mypageSupportClass = `top-navigation-item${path === '마이페이지' ? ' active' : ''}`

    //                    state                    //
    const { pathname } = useLocation();

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onRentClickHandler = () => {navigator(RENT_ABSOLUTE_PATH)};
    const onCustomerSupportClickHandler = () => {navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH)};
    const onMypageClickHandler = () => {navigator(MYPAGE_PROFILE_ABSOLUTE_PATH)};

    //                    render                    //
    return (
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
        )
    }

//                    component                    //
export default function RdrgContainer() {

    //                    state                    //
    const { pathname } = useLocation();
    const [path, setPath] = useState<Path>('');

     //                    function                    //
    const navigator = useNavigate();
    
    //                    effect                    //
    useEffect(() => {
        const path = 
            pathname === RENT_ABSOLUTE_PATH ? '대여' :
            pathname === CUSTOMER_SUPPORT_ABSOLUTE_PATH ? '고객지원' :
            pathname === MYPAGE_PROFILE_ABSOLUTE_PATH ? '마이페이지' : '';
    
        setPath(path);
        },[pathname]);

    //                    render                    //
     return (
    <div id='rdrg-wrapper'>
        <TopBar path={""} />
        <SideNavigation path={path}/>
        <div className='main-container'>
          <Outlet />
        </div>
        <div className='foot-bar'>
            <div>회사정보</div>
            <div>상호 : RDRG 주식회사 대표 : 최지상 사업자 등록번호 : 111-11-11111</div>
            <div>대표번호 : 1111-1111 팩스번호 : 11-1111-1111 메일 : email@email.com</div>
            <div>주소 : 부산광역시 부산진구 중앙대로 668 4층 </div>
        </div>
    </div>
    );
}
